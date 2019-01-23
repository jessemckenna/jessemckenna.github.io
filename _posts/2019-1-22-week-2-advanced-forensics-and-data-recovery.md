---
layout: post
title: Week 2, advanced forensics and data recovery
date: 2019-1-22
---

This week I learned about the area of computer forensics, which is used when computer data enters into legal proceedings as evidence. Forensics can include live forensics (analysis of the state of a running computer system and the preservation of said state in a legally acceptable format), post-mortem forensics (analysis of stored data), and network forensics.

The most important principles are to minimize data loss, record everything, and maintain impartiality, so as to ensure an analyis is admissible in court. The ideal outcome is the use of *triage* to support a finding; this term refers to the use of multiple data sources that all point to the same conclusion.
<!--more-->

#### Digital evidence

My initial preconception about computer evidence was that it would be harder to prove anything with it due to the fact that the state of a computer is constantly changing. I thought it would be almost impossible to prove that a file was changed a week ago, since the initial state of the file would be long gone. This was something of a misconception; although a computer's internal state is always changing, the multitude of components also results in a multitude of fingerprints everywhere. For example, a remote change to a system's database may be provable from a variety of data sources. Network traffic logs on routers and switches, OS logs on the local system, database logs, registry keys, etc. may all contain information pertaining to a single action in question. In forensics, *Locard's exchange principle* holds that any time two objects come into contact, some evidence is left behind, and this seems to apply equally to computer forensics.

Rather than scarcity of data, the main challenges in collecting digital evidence seem to be preservation of data in a way that meets legal standards, and identification of relevant information within a short period of investigation time across a multitude of large storage devices (for example, in the case of a suspect with multiple computers, external hard drives, a smart phone, etc.).

In order to preserve as much data as possible, digital evidence is collected starting from the most volatile sources (active memory, temporary files, caches) to the least volatile (hard disks, physical setup, backups).

#### Optional lab

This week had an optional 'challenge' lab involving static analysis (that is, looking inside files on a disk without running any of them) of some mystery files. This was essentially like a digital escape-room game with locked files, hidden passwords in other files, fake and real data, etc. Thankfully, this activity also featured some pretty generous hints on the part of the lecturer, so I didn't have to waste too much time going down dead ends.

The answers below are in response to the activity's prompts.

**1. What are the targets found on the USB stick?**

The USB contained a password-protected .zip archive as well as some pictures and other miscellaneously file-extensioned files. One of the picture files, when run through FileInsight's Strings plugin, contained the string "pwd:infected123!" which was conveniently the password to the .zip file. This archive contained a .csv file with the following strings listed as 'cybertargets':
* S-Oil Onsan Refinery, Yeosu
* GS Caltex Yeosu Refinery
* Rajani Kant P.
* Akhil Kumar
* Rajesh Nagar
* IT Support Manager
* CEO

**2. Which relevant files were deleted and can they be replicated?**

The PhotoRec file-recovery tool was used to search for deleted files in the lab folder. Recovery of deleted files, called *file carving*, identifies the breaks between files in blocks of 'empty' disk space by identifying blocks matching known header and footer syntax. In other words, if it finds something that looks like a JPG header followed by something that looks like a JPG footer, it can extract them and everything in between as a .jpg.

Running this process on the USB resulted in some cryptic images and other miscellaneous files. One of the images featured a rad 3D-rendered skeleton looming over some URLs ending with *SPEData.zip*.

**2. Investigate possible malware and describe how it works**

A .bin file on the USB began with the characters MZ when viewed in a text editor, which are a set character pattern indicating the beginning of an executable.

Thanks to the lecturer's hints, rather than run the executable, I used FileInsight to look inside it. I ran FileInsight's XOR Text Search plugin with the key 'SPE' which resulted in some strings that looked like credentials.

**3. Display the list of usernames/passwords**

The following credential-like strings were found inside the decrypted .bin file as a result of the process described above:
* SPE\Dayals-1 | London13!
* SPE\JHKim4-1 | !Tomorrow33
* SPE\KManku-1 | M@nday77
* SPE\MMcLean3-1 | @Smiley91

There was also an IP address contained in the decrypted .bin file. Perhaps the .bin file as an executable sent collected credentials to this IP.

**4. What was the offset-value where they were found?**

The above strings were found at offset 0x39334.

**5. What strategy would you advise to the targets?**

Based on the initial information found above, it seems like the USB stick contains some credential-harvesting malware. The targets would probably need to first remove the malware from their organization's systems before changing everyone's credentials. I'm not sure I was able to find enough information to give a more detailed answer.

#### Reflection

This activity was a fun way to get used to using the tools, particularly FileInsight for static analysis and PhotoRec for file recovery. It was interesting to see how data could be hidden inside files while they were still able to look like normal files (like pictures) in the OS. I was also surprised at how well the deleted files were preserved. I knew that deleted files weren't really gone until overwritten on disk, but I thought that it would only take a short time before that disk space was naturally used by other processes. All the deleted data was recovered just fine even though I had been doing other things on the system for a few hours.

The activity also showed me how long a real analysis would probably take. Had I not had some hints to guide me to look at particular files or take certain actions, I could have spent hours guessing and checking on each file to see if I came up with anything useful. It seems like patience and curiosity are probably useful traits for people interested in this field.