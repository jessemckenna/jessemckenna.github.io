---
layout: post
title: Week 5, OS internals
date: 2019-2-8
---

This week's discussion focused on **rootkits**: pieces of malware that conceal their presence from users and the operating system by modifying OS processes themselves. This results in a situation wherein the OS presents false information to the user, usually about the presence or activity of the malware. For example, a user could look in a folder where the malware's files are stored, but the OS would fail to display them because its function to display files has been intercepted.
<!--more-->

Rootkits are most prevalent on 32-bit Windows, although they are possible on all types of operating systems. This week's discussion was largely Windows-oriented. Understanding the basics of the Windows OS is helpful in analyzing rootkit behavior.

#### OS basics
Windows has two modes:
* User mode: includes applications (.exe, .dll files), user drivers, and Windows APIs to interact with the kernel (the core of the OS)
* Kernel mode: includes the OS kernel, kernel drivers (.sys files), and file-system drivers; the kernel mode interacts with the hardware abstraction layer, which interacts directly with system hardware

Most rootkits are .sys files that interact with the OS's kernel mode. This gives them more freedom to make changes to the system. Kernel memory is a flat memory model with no separation between processes, so any kernel driver can access any part of kernel memory. Kernel memory is comprised of code for the Windows kernel itself, and driver code. It includes many OS structures that would be common targets for malware attack, so it is a beneficial place to be for this type of code.

#### Optional lab: rootkit investigation
This week's lab investigated a piece of malware with a rootkit, spookily named *Agony*. I ran the malware while analyzing it via Cuckoo, the malware analyzer also used in week 3. Cuckoo keeps a log of malware actions, as well as copies of any created files.

After running the malware, only three files were visible in the results folder produced by Cuckoo. However, there was actually a fourth file present, not detectable either by looking in Explorer or by running *dir* in the command prompt. This file was called *WinInit.sys*, and could only be found by specifically looking for .sys files in command prompt: *dir \*.sys*.

Because the malware's rootkit had seemingly been successful in hiding a file's presence from the OS, I started up a rootkit-specific analysis tool called Tuluka Kernel Inspector. This tool flagged a few functions as appearing suspicious:
* NtEnumerateValueKey *[used to view the value of a registry key]*
* NtQueryDirectoryFile *[used when listing files in a directory]*
* NtQuerySystemInformation *[used when listing processes]*

If these three Windows-API functions had been hooked (that is, intercepted and modified before reaching the user) by the malware, it would be able to hide its files from the user's view. This would explain why the .sys file created by the malware was not visible in Explorer or *dir* - these applications use *NtQueryDirectoryFile* to list the files in a viewed directory.

Tuluka Kernel Inspector indicated that the three functions' memory locations had been changed as follows:
* NtEnumerateValueKey: original 0x82e93a0f, current 0x9d4d1480
* NtQueryDirectoryFile: original 0x82ea7250, current 0x9d4d1050
* NtQuerySystemInformation: original 0x82e48775, current 0x9d4d0f00

I then used a tool called LiveKD to look at the hooks themselves in memory at these new addresses. At the new memory location for the function *NtEnumerateValueKey*, unassembled by LiveKD, multiple references to *WinInit* plus offsets had been inserted, indicating that this particular function was passing control to the hidden *WinInit* file found earlier.

In order to gather more information about the rootkit, I switched to using two VMs: the system I had been working on (the *debuggee*), plus a *debugger* VM to directly debug the debuggee's kernel itself. As described above, the debuggee had executed the malware using Cuckoo and had some of its OS functions modified; on the debugger, I ran WinDBG and entered Kernel Debug mode to debug the other VM remotely.

The last objective of the lab was to locate the injected code in memory, then find the offset at which it called back to the original code. The code hooked the system function by replacing the system function's location in memory with a jump to itself, then did what it wanted to do, and finally called the original function again. This 'return call' was found at the following offsets:
* NtEnumerateValueKey returned to the original function from its hook at 0x9d4d14d4, an offset of 0x54 from hook start.
* NtQueryDirectoryFile returned at 0x9d4d1086, an offset of 0x36.
* NtQuerySystemInformation returned at 0x9d4d0f1a, an offset of 0x1a.

#### Reflection
It was interesting to see the freedom provided to the rootkit once it was running as a kernel-mode driver. The fact that the OS allowed its internal functions to be changed so easily was fascinating. The software I used to analyze this piece of malware seemed to notice it was suspicious instantly, though, which made it fairly easy to debug. In general, I'm enjoying using WinDBG and working with unassembled code. It feels like debugging a normal program, but with much more information than usual.