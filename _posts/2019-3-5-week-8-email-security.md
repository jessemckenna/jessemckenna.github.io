---
layout: post
title: Week 8, email security
date: 2019-3-5
---

According to this week's lecturer, HR is the most-targeted organizational department for malicious emails, and the average HR employee has an 80% success rate for classifying email as either spam or legitimate. In spite of the common misconception that malicious emails are easy to spot and therefore less of a risk than in the past, email remains a leading infection vector.
<!--more-->
#### Basic terminology
**Spam** is unwanted, unexpected email that is sent to a large number of recipients and typically includes either advertising or malicious content. In security-industry jargon, *ham* is the opposite of spam, i.e. legitimate email.

Classic spam types include:
* *419* spam: typical scam emails (foreign prince, bank transfer, etc.);
* *Canadian pharmacy* spam, i.e. spam advertising the sale of medication; and
* *Pump and dump* spam: fake stock information intended to manipulate the value of a stock.

Spam is often sent using a **botnet**: a group of infected computers controlled by a malicious actor via malware in order to send spam, execute DDoS attacks, etc. In order to avoid detection by anti-spam filters, a technique called *snowshoe spam* is increasingly popular, wherein emails are distributed over many IP addresses and at a slower rate, making the traffic look more like ordinary traffic (as opposed to a large blast of outgoing mail).
    
**Phishing** spam is spam that contains attempts to trick the recipient into following a malicious link, typically one that masquerades as a legitimate website and asks the user to provide private data such as username and password or SSN. These types of emails almost always include some kind of call to action: click this link, call this number, verify your identity by providing some information, etc. A subcategory of phishing called *spear phishing* is the same concept targeted at a particular organization. These types of emails may be highly customized to appear relevant and legitimate to employees at the targeted organization.

#### Combating spam
Combating spam seems to come down largely to *classifying* spam so that it can be filtered, i.e. blocked. To this end, a variety of techniques can be used, including:
* A **spamtrap**: an unprotected account, potentially leaked to the web to be picked up by *spiders* (tools that scrape email addresses from websites), used to collect spam emails for identification. Retired email addresses at organizations can be used for this after it is known that the email no longer receives legitimate mail.
* An **RBL** (realtime black-hole list): a blacklist of known spam senders maintained by some third-party organization. Many such blacklists exist.
* Bayesian filtering: a corpus of known spam emails and legitimate emails, to which unknown emails are compared for classification. This is often done based on the prevalence of certain keywords in the email vs. those in the corpus.
* Heuristics: simple rules/guidelines for classification, ex. of spam emails.

The heuristics used to classify an email may be based on its estimated *reputation* (sender IP, message, URL), or by its *content* (common strings, message attributes, or combinations thereof).

Research techniques used for developing heuristics include:
* **Parsing**: extracting key metadata (source IP, subject, sender);
* **Grouping**: by timestamp, source IP, subject, URL, etc.; and
* **Aggregation**: counting distinct values over time.
    
These techniques provide a path toward accurately classifying unknown emails as either spam or legitimate. Researchers also identify outliers, i.e. cases where similar emails are classified differently. This can provide insights into potential gaps in the heuristics. The amount of manual human input vs. automation needs to be balanced, as human classification can have higher accuracy but much slower speed (and therefore higher cost). Although automated rule generation is much faster, without QA it can result in extremely general rules and high false-positive rates.

If the above techniques are applied effectively, the resulting spam filter will respond with code *554 Denied* to spam emails (i.e. a refusal of receipt), and code *250 OK* to legitimate emails, allowing them to reach their recipients.

#### Reflection
Although email is clearly still a common source of infection, it has been a long time since I saw a spam email in my personal inbox. This is likely testament to the effectiveness of the above techniques; it may not be easy to flawlessly identify spam emails, but current methods seem to be doing a good job.

In my experience, I have seen more spam and phishing attempts at work than on personal accounts. Perhaps spear phishing is increasingly popular (or hard to detect) compared to ordinary spam.