---
layout: post
title: Week 1, an introduction to security
date: 2019-1-15
---

This is the first of nine weekly reflections I will be writing for CS373 *Defense Against the Dark Arts*, which focuses on security and malware analysis.

This week was a basic introduction to malware and the field of security: terminology, tools, and usual actors involved.
<!--more-->

#### Security basics

The term *malware* refers to any malicious software, which can include software that steals information, destroys data, enables remote control, replicates itself, etc. against the interest of the user. The most common infection vectors are the user themselves, USB, downloaded executables, and document files. Malware developers are usually employed by governments, organized crime groups, or companies looking to sabotage competitors.

To respond to new pieces of malware, security companies analyze samples received from customers, known infection sources, etc. Once a sample's behavior is understood, it can be added to an anti-virus or anti-malware program's dictionary and counteracted.

#### Malware analysis assignment

This week's assignment was to execute a piece of malware inside a VM and run a simple analysis of its behavior.

The tools used were:
* FlyPaper: to prevent processes from exiting
* FakeNet: to simulate internet connectivity while remaining offline, and track attempts to use the network
* Process Monitor: to keep a log of any activities done by processes (file read/write, registry access, thread control, etc.)
* Process Explorer: to scrape useful data from running processes, including a useful list of all strings found in a process
* AntiSpy: to look for suspicious behavior and changes to the registry

In my (limited) experience dealing with computer infections, my approach has always been heavy-handed, relying mainly on having a reliable file-backup system and then reformatting right away. Since I've never stopped to investigate any piece of malware before nuking it, this was a new process to me.

Overall, I was impressed by the malware's efficiency in doing its work. It executed without showing anything on screen, and took only a few seconds to install itself, modify the hosts file, download its files, set up scheduled tasks, etc. I was also surprised at how much free rein the OS gives to executables. To be fair, the OS in this case was Windows XP, so more protection is likely in place in more modern OSes, but modern malware is probably also more advanced.

#### Reflection

I can see the appeal of security as a field - the arms race between the two sides seems like a lot of fun, although I personally prefer writing software to running it. I would love to take a look at the source code for the piece of malware I was analyzing. It seems like the developers writing these things must be experts on the OS they tamper with.

This week also reinforced how important it is to avoid infection in the first place. Once a malicious executable is running on the computer, it seems like it's likely too late.