---
layout: post
title: Week 7, web security
date: 2019-2-26
---

This week focused on web security, meaning security in the browser. Although browsers have many security features, the largest security risk remains the user, who may be tricked in various ways: phishing, search-engine poisoning, fake updates or antivirus, URL obfuscation, social-media links, and malicious ads.
<!--more-->
Because the user is vulnerable to inadvertently navigating to a malicious site, it can be helpful for security software to be able to identify malicious URLs quickly and potentially warn the user.

**URL classification**, in which a URL is designated as either malicious or benign, can be done in a variety of ways:
* Content-based: classification is done by inspecting page content, either manually (which is slow but effective against new, unknown threats) or via automatic tools (which is much faster);
* Lexical: without accessing page content, the classifier uses custom rules and machine learning to make judgments based on aspects of the URL string itself, such as its length, ratio of alphabetical to numeric characters, top-level domain, etc.;
* Host-based: using IP address, DNS data, registered domain, and SSL server certificate to make a determination on the trustworthiness of the host; and
* Graph-based: developing a graph of sites and the links between them, then classifying as malicious sites with many links to or from other sites that are known to be malicious.

#### Lab: URL classification
This week's lab was an exploratory exercise in URL classification based on the features of the URL itself and some basic information about the site, such as its age, Alexa rank, etc. The objective was to create a program that would make a classification (malicious or not) for each URL in a JSON dataset, given another dataset of URLs whose status is known to inform the model.

My (fairly straightforward) approach was to first write a program that would calculate the ratio of malicious vs. non-malicious URLs associated with various features (for example, for each top-level domain), then print the results to a text file that my model would later use as reference. I added on top of this some simple heuristics like newer domains and those with low or no Alexa ranking being more suspicious. The final program then averaged the ratios for the various features to get a final 'risk score' that I compared against a reasonable-seeming threshold.

The resulting model is definitely nothing fancy, but it was a fun exercise exploring the data and turning the output of my analysis program into input for my classification program. I wish I could have automated it a little more to include even more URL features; my actual workflow involved more copy-pasting than I would have liked!

#### Reflection
This week's lab felt fun after the heaviness of last week. It also felt like it built on some concepts from last week's CSV-file-parsing Python script, as this week also involved interpreting data using Python. Python: still so fun.