---
layout: post
title: Week 6, network security
date: 2019-2-19
---

The objectives of network security are to keep dangerous hosts or software out, and to protect against both external threats such as DDoS attacks, and internal threats such as worms, botnets, data theft, and damage to critical systems. This week taught the basic terminology used in the security industry, as well as the _robustness principle_, which advocates designing software to handle any conceivable input error.
<!--more-->

**Firewalls** are a type of defense based on the idea of _positive policy_, or whitelisting, wherein the software defines behaviors that are expected or allowed to happen, with any other behaviors being considered suspicious. The advantage of this approach is that it limits the _attack surface_, i.e. the potential methods or entry points by which an attack could be executed. Firewalls also commonly implement policies, i.e. sets of rules, by security zone, with different zones for intranet, internet, trusted clients, etc. Firewalls can be web gateways, which block web transactions, or email gateways, which filter or scan email to guard against malware infiltration or data loss via email.

In contrast, an **intrusion detection/prevention system** implements a blacklist based on the behavior of known threats. This is good at catching known threats, while ineffective against new types of attacks, called _zero-day attacks_. Although known vulnerabilities are typically patched once recognized, this blacklist is still useful in case of systems running outdated software versions. A modern expansion on this concept is **reputation**, wherein big-data-style analysis is used to keep track of IP addresses associated with spam, malware, etc.

The most important idea of the week is **defense in depth**, which is the acceptance that any layer of defense could fail. A good network-security design involves many layers, with no one layer being viewed as infallible. This really seems like a good software design principle in general.

#### Exercise: robustness principle
*Instructions: for the following paragraph, mark the parts you think are still valid, and the parts you think are no longer valid from our perspective, 35 years later. Add bullet points to justify your opinion.*

Robustness Principle: 1980-1989 from RFC-1122 Jonathan Postel, 1989
Once there was a great man, named Postel.  See RFC 2468.

1.2.2 Robustness Principle
At every layer of the protocols, there is a general rule whose application can lead to enormous benefits in robustness and interoperability [ref to rfc760, 1980]: 
	“Be liberal in what you accept, and conservative in what you send” 
* **Valid**
* The variety of network-connected devices is likely to continue expanding, and end users vary greatly in how quick they are to update to new versions; systems still have no choice but to accept a wide variety of connections, inputs, etc. regardless of the security issues it creates.

Software should be written to deal with every conceivable error, no matter how unlikely; sooner or later a packet will come in with that particular combination of errors and attributes, and unless the software is prepared, chaos can ensue. In general, it is best to assume that the network is filled with malevolent entities that will send in packets designed to have the worst possible effect. 
* **Valid**
* Defensive software design is still a good idea; software errors are by nature unexpected, so it's good to try and cover as many situations as possible.
* It's not necessary to assume that the network is *filled* with malevolent entities, but a huge portion of the world's population uses the network. Even if only a tiny fraction of that population is malevolent, it still poses a significant risk.

This assumption will lead to suitable protective design, although the most serious problems in the Internet have been caused by unenvisaged mechanisms triggered by low-probability events; mere human malice would never have taken so devious a course! 
* **Valid?**
* If I'm reading this line correctly, it asserts that the most serious problems arise from human error rather than intentional attacks. I'm not sure if this is still true - more research needed!

Adaptability to change must be designed into all levels of Internet host software. As a simple example, consider a protocol specification that contains an enumeration of values for a particular header field—e.g., a type field, a port number, or an error code; this enumeration must be assumed to be incomplete. Thus, if a protocol specification defines four possible error codes, the software must not break when a fifth code shows up. An undefined code might be logged (see below), but it must not cause a failure.
**Valid**
* This advice is essentially to handle even unexpected inputs, which makes sense to me (especially from a security standpoint).

The second part of the principle is almost as important: software on other hosts may contain deficiencies that make it unwise to exploit legal but obscure protocol features. It is unwise to stray far from the obvious and simple, lest untoward effects result elsewhere. A corollary of this is “watch out for misbehaving hosts”; host software should be prepared, not just to survive other misbehaving hosts, but also to cooperate to limit the amount of disruption such hosts can cause to the shared communication facility. 
**Valid**
* I think this still makes sense - make software output as standard as possible to avoid breaking less robust counterparties, while being prepared for non-standard communications yourself. No portions of this entire paragraph appear to be outdated to me.

#### Exercise: firewall policy rules
*Instructions: specify firewall rules in the table below. Use parens, &, | as needed.*
*(prepopulated fields in italic)*
						
| #  | Source                       | Destination            | Service                              | Action   | Alert | Comment                                                                           |
|----|------------------------------|------------------------|--------------------------------------|----------|-------|-----------------------------------------------------------------------------------|
| 1  | *Intranet*                   | *Internet*             | *(HTTP & TCP/80)|(HTTPS & TCP/443)*  | *Permit* | *No*  | *Everyone on the Intranet is allowed to browse the Internet*                      |
| 2  | *Intranet*                   | *???*                  | *DNS & UDP/53*                       | Deny     | *No*  | *How do you think DNS should work from the Intranet out?*                         |
| 3  | *Intranet*                   | *Internet*             | *SMB*                                | *Deny*   | *Yes* | *Do not allow file browsing over the internet, alert so we can catch the sucker.* |
| 4  | Corp DC                      | Cloud DC               | FTP                                  | Permit   | No    | *Connect the data centers (Corp DC, Cloud DC)*                                    |
| 5  | Cloud DC                     | Corp DC                | FTP                                  | Permit   | No    | *Connect the data centers (Corp DC, Cloud DC)*                                    |
| 6  | Intranet                     | Corp/Cloud DC          | *SMB*                                | Permit   | No    | *Enable corporate workstations to share files with the DCs*                       |
| 7  | Internet                     | DMZ web server         | (HTTP & TCP/80)|(HTTPS & TCP/443)    | Permit   | No    | *Enable traffic into the DMZ web server*                                          |
| 8  | Intranet                     | DMZ mail server        | *SMTP*                               | Permit   | No    | *Enable the DMZ mail server*                                                      |
| 9  | DMZ mail server              | Internet               | *SMTP*                               | Permit   | No    | *Enable the DMZ mail server*                                                      |
| 10 | *Partner 1 on Internet*      |                        | *HTTPS*                              | Permit   | No    |                                                                                   |
| 11 | *Trusted client on Internet* |                        | *HTTPS*                              | Permit   | No    |                                                                                   |
| 12 | Internet                     | Lab server             | HTTP | HTTPS                         | Deny     | Yes   | *Protect lab servers from Internet traffic*                                       |
| 13 | Intranet                     | Lab server             | *SSH*                                | Permit   | No    | *Enable corporate users to access the lab machines*                               |
| 14 | Intranet                     | *Extranet supplier 7*  | *HTTPS*                              | Permit   | No    | *Access an extranet partner*                                                      |
| 15 | Intranet                     | Cloud DC               | *SSH*                                | Permit   | No    | *Backup servers*                                                                  |
| 16 | Intranet                     | Corp DC                | *SSH*                                | Permit   | No    | *Backup servers*                                                                  |
| 17 | Trusted client on Internet   | *Cloud DC*             | *RemoteDesktop*                      | Permit   | No    | *Remote desktops for corporate users*                                             |
| 18 | Trusted client on Internet   | Cloud DC               | *RemoteDesktop*                      | Permit   | No    | *Allow users to connect to their desktops from home*                              |
| 19 | Trusted client on Internet   | Cloud DC               | *VMWare control*                     | Permit   | No    | *Allow users to connect to their desktops from home*                              |
| 20 | Internet                     | *Corporate Web Server* | (HTTP & TCP/80)|(HTTPS & TCP/443)    | Permit   | No    | *Internet users can browse corporate web server*                                  |
| 21 | Intranet                     | *Corporate Web Server* | SSH                                  | Permit   | No    | *Local admins can maintain the corporate web server*                              |
| 22 | Intranet                     | *Corporate Web Server* | (HTTP & TCP/80)|(HTTPS & TCP/443)   | Permit   | No    | *Intranet users can access corporate web server*                                  |
| 23 | Intranet                     | Corporate Mail Server  | POP3 | IMAP                          | Permit   | No    | *Corporate users can read their mail*                                             |
| 24 | Intranet                     | Corporate Mail Server  | SMTP                                 | Permit   | No    | *Corporate users can send mail*                                                   |
| 25 |                              | *Corporate DNS server* |                                      |          |       | *DNS server rules*                                                                |
| 26 |                              | *Corporate DNS server* |                                      |          |       | *DNS server rules*                                                                |
| 27 |                              | *Corporate DNS server* |                                      |          |       | *DNS server rules*                                                                |
| 28 |                              |                        |                                      |          |       |                                                                                   |
| 29 |                              |                        |                                      |          |       |                                                                                   |
| 30 |                              |                        |                                      |          |       |                                                                                   |
| 31 |                              |                        |                                      |          |       |                                                                                   |
| 32 |                              |                        |                                      |          |       |                                                                                   |
| 33 |                              |                        |                                      |          |       |                                                                                   |
| 34 |                              |                        |                                      |          |       |                                                                                   |
| 35 |                              |                        |                                      |          |       |                                                                                   |
| 36 |                              |                        |                                      |          |       |                                                                                   |
| 37 |                              |                        |                                      |          |       |                                                                                   |
| 38 |                              |                        |                                      |          |       |                                                                                   |
| 39 |                              |                        |                                      |          |       |                                                                                   |
| 40 | *ANY*                        | *ANY*                  | *ALL*                                | *DENY*   | *NO*  | *Firewall policy is best done with a deny all rule at the bottom.*                |
  
#### Reflection
This week had a ton of work! In addition to the lectures and exercises described above, we also had to code a program that could:
1. Enumerate processes,
2. List process threads,
3. Enumerate loaded modules (i.e. shared libraries),
4. Show executable memory pages, and
5. Read memory.
I made the mistake of choosing the deadly combination of C++ and Unix for the project, not knowing that reading this information in Unix would require almost nothing but file I/O and string manipulation. It wasn't my or C++'s best moment, but it was a fun challenge.
On top of that project, we also had a lab wherein we had to write a Python script that parsed a CSV file of network packet data and did some analysis. It was super fun! I love coding in Python.
This week would have been a blast had I had infinite time, but as it was, I was stretched pretty thin. With this blog post, I made it, though!