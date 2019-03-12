---
layout: post
title: Week 9, mobile security
date: 2019-3-11
---

This is my last summary writeup! This week was about mobile OSes, mostly Android, and the malware that targets these platforms. A large amount of malware that targets mobile devices tricks the user by **repackaging** some legitimate existing software to include a malicious payload. In this approach, the original software still works as intended, but is redistributed with the malware hidden inside the installer or executable. This technique was developed in 2011, but mobile malware has existed since the early 2000s in various forms.
<!--more-->
#### Mobile malware history
The *smartphone revolution*, i.e. the period during which smartphones increased in popularity to become commonplace, began in 2007 with Apple iOS. At the same time, Android was acquired by Google, going on to become the dominant smartphone OS over the next decade. The Windows phone launched in 2010.

On iOS, bypassing system security to run unauthorized software is called *jailbreaking*, and is commonly used to open security backdoors or unlock carrier-locked phones. On Android, this is called *rooting*, i.e. getting root privilege on the system; rooting is usually done to remove preinstalled applications or bypass manufacturer/carrier restrictions. As malware has evolved, mobile OSes have also had to evolve security features to keep up with new threats.

The earliest mobile malware was developed from 2000-2004, and more novel techniques and uses were invented in 2005-2006 such as cross-platform malware and use of malware to leak sensitive data. The period from 2006-2008 saw the first use of malware for direct financial gain.

From 2008-2010, the smartphone revolution significantly changed the mobile phone market, as well as increasing the potential gain for malware developers. In 2009, the first mobile botnet was developed; this program executed silent outgoing Internet communication to a remote server, setting the precedent for further mobile botnet applications to come. In the same year, the first iOS malware was developed; this application used the OS's default password to infect a user's phones, then charged the user a $5 ransom to unlock the phone.

In 2010, the first Android malware was developed. Although this first piece of malware had simple functionality and limited impact, Android malware prevalence increased significantly in 2011, from less than 50 new types of infections found per quarter at the beginning of the year to 400 per quarter at the end of the year.

2011 also saw the first Android-specific botnet, geinimi, distributed in China. This malware employed several sophisticated methods, including the first repackaging of legitimate software to include a malicious payload, execution of commands sent by a remote command-and-control server, the use of TCP sockets to enable multiple instances on one device, and encryption of its communications, commands, strings, etc.
      
Also in 2011, the first malware present on the official Android app market was found. In response to the presence of the malware, Google remotely removed the malicious apps from affected devices by installing a security patch on users' phones. Some malware authors went on to repackage the fix itself to disguise even more malware.

In addition to the problem of ever-advancing malware techniques, mobile OS security also suffers from the **fragmentation problem**, which refers to the fragmentation of the userbase across versions, as not all users update their systems. This results in threats to even fixed vulnerabilities persisting on out-of-date systems.

#### Android architecture
The basic components of the Android architecture are applications, the application framework, libraries, the Android runtime, and the Linux kernel around which the OS is based.

Android applications are contained in **APK files**, which have the following components:
* *assets* directory: contains raw files used by the app; many malware apps use this folder to hide their binary behind a seemingly benign file extension;
* *lib* directory: native libraries used by the application;
* *META-INF* directory: the application's RSA digital certificate;
* *res* directory: contains images and front-end XML;
* *AndroidManifest.xml*: the application's *manifest*, a declaration of its permissions, components, etc. that is set at installation time;
* *classes.dex*: the application's Java executable; and
* *resources.arsc*: compiled XML data from the application's views.

An Android application includes the following general components:
* **Activities**: user views in the UI;
* **Services**: functions that run in the background, without a user-visible display;
* **Broadcast receivers**: functions to respond to system-wide announcements, ex. BOOT_COMPLETED, SMS_RECEIVED; and
* **Content providers**: functions to manage shared application data.

Inter-process communication on Android can be done in the following ways:
* Content providers expose data to other processes;
* The application sends an *intent*: an Android-specific type of message between apps; or
* The application uses a *binder*: a way to call a routine in another app.

In addition to the above techniques for inter-process communication, there are a variety of unofficial ways that processes could communicate, including signals (to processes in the same process group), pipes, sockets, writing to another app's message queue, semaphores (shared variables read/written by many processes), and reading/writing to/from shared memory.

#### Reflection
My impression from this week's lectures was that mobile OSes face many of the same challenges as desktop OSes when it comes to security: new malware techniques exploiting formerly unknown vulnerabilities, a userbase fragmented across both old and new software versions, the balance of enabling third-party software enough freedom to use the system effectively while maintaining security, etc.

Both iOS and Android try to mitigate the potential damage from malicious apps by **sandboxing** applications, i.e. running them in a closed environment without direct access to system resources or other applications. Regardless, it seems like malware developers consistently find a way around the limitations they are given.

The common theme that has stuck out to me throughout this class has been the arms race between the malware and security industries. It's interesting learning about the clever innovations made by both sides to try and win this game - I just hope they stay evenly matched.