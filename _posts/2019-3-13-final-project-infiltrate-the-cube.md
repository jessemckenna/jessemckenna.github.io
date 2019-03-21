---
layout: post
title: Final project, infiltrate the cube
date: 2019-3-13
---

This is my final project for CS373. The final is to complete 'hacking' challenges on a sandbox website designed to allow people to practice these techniques. As posting solutions to the challenges is against the site's ToS, I will take down this post after it has been graded.

<!--more-->
#### Challenge 0: Get an invite code

**How I completed this challenge:**

I stepped through the function defined in *inviteapi.js* and saw in its return value an API call to function *makeInviteCode()* at URL */api/invite/how/to/generate*. I ran this POST request in a separate script, which returned encoded instructions on how to request an invite code: "In order to generate the invite code, make a POST request to /api/invite/generate". I modified my POST request's URL to */api/invite/generate*, and this returned another encoded string. I decoded it with the same encoding as was used in the instructions string (base64), which resulted in a working invite code.

**Thought process:**

This first step was really challenging for me as I really had no idea where to start.

My first thought was to poke around in Chrome Dev Tools to try and see if I could find some hint on what constitutes a valid invite code - for example, some kind of input validation built into the form submittal.

After digging through the site's frontend .js file, I felt a bit lost and decided I needed a more efficient way of finding what I was looking for. After all, I figured there was no way the actual challenges would consist of "read all the .js until you find something". I noticed that Dev Tools has a breakpoint feature and wondered if I could submit a wrong invite code and then somehow monitor the page to see what happens when it checks for invite code validity.

I set an Event Listener Breakpoint on Control > submit, i.e. told Dev Tools to break when a form is submitted. This resulted in a lot of freezing of Chrome in general, which I ultimately found out was caused by my extensions. Lesson learned: disable extensions before using Dev Tools!

This train of thought ended up being abruptly interrupted when I noticed an *inviteapi* script that I had missed before in the site's files.

It defined and called a function that receives as parameter a long string of symbols that resembled a regular expression, followed by two numbers and another string containing what looked like a list of function names.

Of most interest to me in this list of function names was *makeInviteCode*. I tried to call it directly from the Dev Tools console but got an error message, so I instead tried stepping through the *inviteapi* script to see exactly what it did and hopefully get some hints on whether I could potentially call the *makeInviteCode()* function.

The return value of the function defined in *inviteapi* was a long string containing calls to functions *verifyInviteCode(code)* and *makeInviteCode()*. It seemed to me that this function was essentially a compact caller for the actual API. I copied the contents of the full POST request to *makeInviteCode()* that I found in the function's return value, which included a link to the API URL */api/invite/how/to/generate* from which a code could be returned.

I pasted this POST request into the console to see if I could print the result of the call to *makeInviteCode()*, but it printed *undefined*. I also tried pasting it into the invite code form field, hoping to make [the result of the function makeInviteCode()] my code input value, but this simple approach didn't have any effect. I also tried modifying the return value of the function-selection function directly in Dev Tools, but it didn't save my changes. At this point I was feeling pretty stupid, but oh well!

I felt that I was perhaps onto something with running the function in the console, but was unsure why I was getting a return value of *undefined*. I tried running the script in a snippet (a short temporary file provided by Dev Tools to run JS scripts) instead, but got the same result. I realized that since I was running this function outside the site itself, I needed to add the site URL before the relative URL contained in the arguments.

After I fixed that mistake, I got a return value - a 404 error! This was pretty exciting, because it meant at least I had the JS working. I tried tweaking the URL a little (I had made some assumptions about what the first portion of the URL would contain, and was unsure), and this time I got a successful response containing a code! Pretty exciting. I copy-pasted it into the input field, and to my surprise... it didn't work.

I noticed another field was returned, *enctype: "base64"*. Maybe I needed to decode it? I went ahead and did that, and instead of the code I was expecting, I got a string instead: "In order to generate the invite code, make a POST request to /api/invite/generate".

This was super disappointing! Did I just trigger the tutorial mode for slow people?? Actually, when I looked at the URL, I realized that I was making a request to *api/invite/how/to/generate* the whole time, so I don't know what I expected.

Once I made the POST request to the correct URL at *api/invite/generate*, I got a code! It also had a second field *format: "encoded"*. I went ahead and decoded it from base64 again (essentially guessing that it would be encoded the same way), and the result worked!

**Tools used:**

I only used Chrome Dev Tools for this challenge, including the snippet feature for running JS separately from the page. I also used an online [base64 decoder tool](https://www.base64decode.org/) for decoding.

#### Challenge 1: Deceitful Batman (10 points)

**How I completed this challenge:**

I researched how to decrypt an unknown cipher, and through this research found out that most two-character encryptions use *Baconian ciphers*. I split the ciphertext into five-character segments (as Baconian ciphers substitute five-digit segments for letters) and found that it split evenly, which further supported the idea that the cipher was Baconian. Based on this, I entered the string contained in the challenge file into an online Bacon cipher decoder. The tool successfully returned a string that explicitly told me the flag.

![First challenge clear!](/assets/images/blog/1-proof.jpg)

**Thought process:**

After I got access to the challenges themselves, I began by installing a Kali Linux VM to help me with the challenges, as Kali Linux offers VirtualBox VM images pre-installed with a wide variety of tools.

This challenge was under the *cryptography* section and contained a single text file containing a string of A's and N's. I decided to see if the Kali Linux VM I set up earlier had any cryptography-related tools that could be helpful to me.

I found one called *hashcat*, but it seemed to want to know what kind of hash was being used - I may have just been holding it wrong, but it didn't seem like what I was looking for. After doing more research, I found another built-in program called *hashid* that seemed like it could identify the hash type for me.

I ran *hashid* with the string contents from the file, and it gave me the output "[+] BigCrypt". So far, so good! At this point I really felt like installing the VM was worth the effort.

I went back to *hashcat* hoping to decrypt the string at this point, but unfortunately didn't find BigCrypt in its list of hash modes. I did a bit of searching online, and found a few pages that seemed to indicate that another program called *john* on Kali Linux supports BigCrypt decryption. Unfortunately, I couldn't get this other program to work either - it seemed to not have support for the BigCrypt format. I tried a few different related-seeming formats such as *des* and *crypt*, but came up with no result for any of them.

At this point I was feeling a little frustrated, especially as this was only a 10-point challenge. Perhaps I was overcomplicating it? I thought the tools would perhaps make the challenge trivial, but that seemed to not be the case. I decided to go back to square one and research the best way to identify an unknown encryption. I found an article on this topic that stated that most two-character encryptions are likely to use *Baconian ciphers*, wherein each letter is replaced with a sequence of five binary digits.

I returned to the encrypted text and broke it into five-digit segments; it split evenly that way, which seemed to be a good sign.

I went to an online "Bacon Cipher decoder" and pasted the string there, and got a result string that told me the flag! After I stopped overengineering my approach, I reached the solution surprisingly quickly.

**Tools used:**

Although I experimented with several tools, including *hashid*, *hashcat*, and *john* on a Kali Linux VM, I ultimately only needed online research (particularly the article on decrypting unknown ciphers at [Practical Cryptography](http://practicalcryptography.com/cryptanalysis/text-characterisation/identifying-unknown-ciphers/)), plus the Bacon cipher decoder at [dCode](https://www.dcode.fr/bacon-cipher).

#### Challenge 2: Sick Teacher (20 points)

**How I completed this challenge:**

I noticed that the structure of the encrypted text looked identical to English, and made a few initial guesses at the identity of a few characters based on their position in the text (for example, I noticed that "H" often appeared as a word of its own, so guessed that it represented "A"). After these initial guesses, I used an online substitution tool to visualize the result of my guesses so far. This made some more words and phrases obvious, so I continued guessing characters that I had high certainty of, which in turn made even more words obvious. I continued this process until I had decoded the entire text.

![Done with the fun second challenge!](/assets/images/blog/2-proof.jpg)

**Thought process:**

This challenge was a single text file with some encrypted text in it. I immediately noticed that the text seemed to have spaces, numbers, and punctuation in the same way that plaintext would, so I decided it would be safe at this point to assume that those were not encrypted. The text was in all capitals. There were also some obviously repeating short words that I thought were likely to be common prepositions; for example, the string "CZ 2017" seemed like it could mean either "is 2017" or "in 2017", as the word "CZ" appeared in several other places. I also noticed many instances of "H" on its own, as a separate word, which seemed likely to be either "A" or "I", assuming the plaintext was in English.

I decided to try deciphering it as a Caesarian cipher using H = A as a starting guideline, then H = I if that did not seem to work. I was familiar with Caesarian ciphers from previous classes so this was an obvious first step to me.

A Caesarian cipher is one in which every letter of the alphabet is 'rotated' by some number of characters. For example, if the number were 1, A would be encrypted as B, B as C, etc., until Z would 'wrap around' and be encrypted as A.

If H represented A, as in my first assumption, the number in this case would be 7. If H instead represented I, the number would be 25.

Decrypting with the number 7 unfortunately didn't result in anything readable. 25 also resulted in gibberish. Just for good measure, I used an online tool to try all possible rotation numbers, but none of them were readable, so I decided that I could rule out Caesarian cipher as a possibility at this point.

I went back to the article *Identifying Unknown Ciphers* that I used as reference in the first challenge, and saw the mention of "simple substitution". Because of the relative obviousness of some of the letters, I decided that I may be able to make some headway simply by filling in the letters that I was confident of based on their frequency and the structure of the words. This way, I figured, I could either solve the cipher or reach some kind of clue about how the cipher may be structured.

Initial assumptions:
* H = A: H appears on its own throughout the text.
* B = I: B appears on its own, but only at the beginning of a sentence.
* CZ = OF: because I was already making a guess at the letter "I", I revised my initial guess at the meaning of "CZ 2017" to "of 2017".
* ZGHF = FLAG: this string appeared right at the end of the text before another, very long, word, and knowing that this text likely contained the flag itself, I made an initial guess that the very long ending word was the flag, and that this word was simply "flag" to indicate as much.

Although these guesses were mostly exploratory, made in hopes of gathering more information, they seemed to be surprisingly accurate. Using an online *Monoalphabetic Substitution Decoder* tool, which decoded the text in real time as I entered characters, revealed more strings that hinted at further letters.

![The partly decoded text](/assets/images/blog/2-decoding.jpg)

The sequence of guesses I made is as follows (with as-of-then unguessed letters represented as \_).

* \_ALL OF FA\_\_: HALL OF FAME
* I\_ MA\_ OF 2017: IN MAY OF 2017
* F\_OM ALL O\_ER \_HE GLO\_E: FROM ALL OVER THE GLOBE
* \_IN\_E THEN, IT HA\_ GRO\_N: SINCE THEN, IT HAS GROWN
* TO\_ 100: TOP 100
* THO\_SAN\_S OF MEMBERS: THOUSANDS OF MEMBERS

At this point, the rest of the letters were trivial to guess and I had my answer! The resulting alphabet looked fairly random to me, so I'm not sure if there was a cleverer way than this simple guessing-based approach. I really enjoyed seeing the text slowly come together, though - it felt a like a game.

**Tools used:**

I again referenced the article *Identifying Unknown Ciphers* at [Practical Cryptography](http://practicalcryptography.com/cryptanalysis/text-characterisation/identifying-unknown-ciphers/)) to get the process started, then used the monoalphabetic substitution decoder at [dCode](https://www.dcode.fr/monoalphabetic-substitution) to make decoding the text easier.

#### Challenge 3: Weak RSA (20 points)

**How I completed this challenge:**

I initially used *openssl* to extract *n* and *e* from the key file, then attempted to use my understanding of RSA and various mathematical methods/calculators to manually back-calculate *d* from derived values for *p* and *q*. However, I found that the numbers became too large for my tools to handle, especially when it came time to actually calculate *d*, and I ultimately used a tool called *RsaCtfTool*, which took the key and encrypted text as input and printed as output the decrypted contents.

![Sweet freedom](/assets/images/blog/3-proof.jpg)

**Thought process:**

This challenge consisted of two files: *flag.enc* and *key.pub*. The contents of *flag.enc* were unreadable by a simple text editor, while *key.pub* contained the text "BEGIN PUBLIC KEY", followed by a long string of random-seeming characters.

I had just learned about RSA in a different class, so had some preconception of what to expect. In RSA public-key encryption, the sender encrypts message M with the receiver's public key, and the encrypted message can only be decrypted with the receiver's *private* key, which only the receiver holds. The trick to this method is some fancy math, which results in a special relationship between the public and private key numbers.

If *key.pub* contained the public key, that would not help me decrypt the message; also, *key.pub* did not explicitly contain a number. However, considering this challenge was called "Weak RSA", I figured that perhaps the private key was not necessary in this case.

I first wanted to figure out what kind of format was being used for the key, hoping to get some clues from that. I tried running the *hashid* utility on *key.pub*, but got no results. I also tried removing the "BEGIN PUBLIC KEY" text and removing line breaks, but it made no particular difference.

I felt that I was perhaps at risk of overthinking the solution again, so decided to step back. I thought that perhaps "Weak RSA" implied that the text could be decrypted with only the public key. This seemed like a good starting point, anyway - if I did have the key at hand, how would I apply it to the text? It seemed there was no point trying to be fancy before I even knew that.

After some research, I found that the tool is called *openssl*. I tried decrypting the encrypted flag using *key.pub* via the command *openssl enc -d -aes-256-cbc -in flag.enc -out flag.txt -pass file:./key.pub*, but got the response *bad magic number*. I also tried adding the flags *-md md5* per some recommendations online but had no luck.

At this point I felt that I was grasping at straws. I wondered whether the key itself was encoded, and during my research came across a Stack Overflow post titled [*How to check whether a string is base64-encoded or not*](https://stackoverflow.com/questions/8571501/how-to-check-whether-a-string-is-base64-encoded-or-not), the answer to which indicated that base64-encoded text consists of the characters A-Z, a-z, 0-9, +, and /. I noticed that the key in *key.pub* only contained these characters. I decoded the key from base64, which resulted in many unprintable characters. I tried using this decoded key to decrypt the flag, but I unfortunately got the same *bad magic number* error as before.

![The base64-decoded key, which unfortunately did nothing](/assets/images/blog/3-base64decodedkey.jpg)

At this point, I began questioning my initial guess that the 'public key' provided could be used to directly decode the flag. That certainly would make it weak, but probably wouldn't quite qualify as RSA - perhaps I did need to figure out the other elements of RSA from the public key. This shouldn't be doable, but since it was *weak* RSA, I thought that perhaps in this case it could be.

I was still perplexed as to how I could extract a number that I could work with from the string of numbers and letters in *key.pub*. After some research, I found an article [Generate a keypair using OpenSSL](https://en.wikibooks.org/wiki/Cryptography/Generate_a_keypair_using_OpenSSL) that described a command that would extract the 'elements', i.e. the prime numbers used to generate the key, from a key.

I followed the sequence of commands provided in StackOverflow post [RSA: Get exponent and modulus given a public key](https://stackoverflow.com/questions/3116907/rsa-get-exponent-and-modulus-given-a-public-key) to get the modulus and public exponent in hexadecimal.

![The long numbers extracted from the key](/assets/images/blog/3-extractcomponents.jpg)

RSA keys are constructed by choosing two large prime numbers, called *p* and *q*. Based on these values, *n* = *pq* and *z* = (*p* - 1)(*q* - 1) are calculated. Some number *e* is chosen such that *e* < *n* and has no common factors with *z*, and some number *d* is chosen such that *ed* - 1 is divisible by *z*.

After all this calculation, the public key is (*e*, *n*), and the corresponding private key is (*d*, *n*). A message M is encrypted by calculating M^*e* % *n*, using the values from the public key, and an encrypted message E is decrypted by calculating E^*d* % *n*, using the values from the private key.

The values I got from the *openssl* output were the modulus and exponent, respectively, i.e. *n* and *e* in the above formula. These values were surprisingly huge! *n* was 310 digits long, and *e* was 309 digits long. At this point I was really doubting whether this was going to go anywhere, as I expected the numbers to be simpler if they were intended to make *d* easy to guess.

Despite my doubts, I brainstormed what additional information I would need to reach *d* using *n* and *e* (although in normal RSA this shouldn't be feasible). It seemed that no matter what, I would need to derive *p* and *q*, the two primes multiplied to reach *n*. Could I perhaps find two prime factors of *n*, for which the known *e* still met its requirements?

After researching online, I found several calculators that could find all the factors of a number. However, many of the simple factorization calculators had a small upper size limit. I eventually found an RSA-specific one that allowed me to enter the *n* value I had found, but it seemed to crash upon calculating. At this point I was pretty frustrated. Did this mean the RSA was actually not guessable? Perhaps the large size of *n* is what makes it secure.

I found a StackOverflow thread [Cracking short RSA keys](https://stackoverflow.com/questions/4078902/cracking-short-rsa-keys) wherein a participant wrote that an easy way to find two prime factors of a large *n* was to check each odd number starting below floor(sqrt(*n*)) until a prime factor was found.

After some struggle finding a calculator that would calculate the floor of the square root of this large number for me (I ultimately installed the *bc* command-line math utility on my Kali Linux VM), I finally got the correct value and began incrementing down 2 at a time to check each odd number below the square root. This worked initially, but I was then stuck for a while on how to check whether the resulting numbers were prime. I spent a lot of time searching, calculating, etc.; I also found a list of primes online, but the largest prime listed was smaller than the number I needed to check. I was really frustrated at this point!

After a sanity break, I did more research on how to factor a large *n*, more specifically in the context of RSA this time. I found some discussion threads referencing a website [factordb.com](factordb.com) that could factor large numbers, so (giving up on the square root idea) pasted my original *n* into this website. It resulted in two large numbers. I wasn't sure whether they were prime, and the website was pretty minimalistic, but I decided to assume they were and go ahead with the numbers it provided, since this website was cited as a resource for RSA in particular.

![The factors provided by factordb.com](/assets/images/blog/3-factorresults.jpg)

If *p* and *q* were in fact as provided by the calculator, I would need to calculate *z*, then choose a number *d* such that *ed* - 1 is divisible by *z*. With the help of command-line calculator *bc*, I calculated *z* (as expected, a huge number). At this point, I just needed to calculate *d*. I thought this would be a trivial victory lap, but the resulting equation seemed to be complicated. I searched online for the best approach, and found that I needed to apply the Extended Euclidean Algorithm to calculate *d*.

Unfortunately, trying to calculate this on my extremely long numbers hit the input limit on Wolfram Alpha, and my trusty command-line utility *bc* seemed to lack the necessary functions for the formula. Frustratiiiiiing!

Not eager to spend any more time on this challenge than I already had (a lot), I continued to try and find a calculator that could do the necessary algorithm for me so I could get *d* from the values I had already determined/guessed at (*e*, *n*, *p*, *q*, and *z*). I eventually found a tool called *RsaCtfTool*, seemingly designed for cracking RSA keys. I felt a bit silly for doing as much as I had done by hand when this tool had existed the whole time, but oh well.

After downloading the file and installing all of its prerequisites on my Kali Linux VM, I ran its *uncipher* command on the original public key and flag files. It took about ten seconds to run, but ultimately printed out a string of unprintable characters followed by what looked like a flag. It was a pretty underwhelming end to a frustrating process, but at least I finally made it.

**Tools used:**

Although I used a huge variety of tools and web calculators, as well as a lot of online research, I ended up only needing a single tool that did everything by itself, called [RsaCtfTool](https://github.com/Ganapati/RsaCtfTool).