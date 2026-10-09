---
title: "One repo, two products: why I'm splitting NihonWorld before adding features"
description: "Why NihonWorld is becoming two projects, and how Claude, ChatGPT and I made the decision."
date: 2026-10-08
series: "Devlog #1"
tags: [nihonworld, architecture, adr, ai-agents]
jira: DLOG-1
diorama:
  name: one-repo-two-products
  jp: 分割
  en: the split
  note: approved content crosses one way
spec:
  key: JAI-5
  text: Decide how to separate the repositories.
  rows:
    - [status, Done]
    - [sub-tasks, 6 / 6]
    - [output, ADR-001 accepted]
---

NihonWorld is a Japanese tutor you play. There's a 3D room, a school, and later places where you
talk to people. Everything is still grey boxes, and that's on purpose.

I've been building it with AI assistants for a few weeks. This week I stopped adding features and
spent four days deciding how to split it into two projects. I didn't write a single line of
refactoring code until the plan was done. This post is about why, and about how the decision got
made, because honestly the process taught me as much as the result.

## How it started

The whole project hangs on one rule:

> **Pedagogy is deterministic. The LLM is an actor that gets told what to do.**

Plain code decides what you learn, when you review it, and whether your answer was right. That's
spaced repetition with FSRS, plus rule-based grammar checks. A language model can improvise a little
scene with the words it's given, but it never gets to decide anything.

And the rule isn't just written down somewhere. A dependency check runs on every commit, so if the
scheduler ever imports the model client, the commit fails and tells you why. Optional parts, like the
voice engine, live in their own folder that the core never touches. There's even a test that copies
the project *without* that folder and runs everything. If something breaks, the part wasn't really
optional.

So far so good. The problem was that one repo was doing two different jobs:

- **the game:** what the player sees, and what they've learned so far;
- **making the content:** analysing Japanese sentences, looking words up in the dictionary,
  generating sentences, and all the tools that prepare a lesson.

## Why two projects

Three reasons pushed me to split it.

**1. Two builds that need different things.** I want one build I can hand to other people someday,
and one personal build where I can play with LLMs and spoken conversation. The shareable one has no
live generation at all. Every sentence and exercise is generated ahead of time, reviewed, and frozen,
and the audio is recorded in advance. The experiments stay in my build, and there are good reasons
for that: the voice engine I use can't be redistributed without permission, and a local LLM means
gigabytes of model and a decent GPU. None of that belongs in something you give to someone else.

**2. Generate, review, freeze.** If content is generated, somebody has to approve it before a learner
ever sees it. Splitting the project turns that rule into an actual wall. The **Generator** proposes.
**NihonWorld** only keeps what was approved, pins it with a hash, and builds a versioned content
package from it. The short version: *NihonWorld never depends on the Generator.*

**3. Licences.** Anything inside a build you share has to be cleared. Having one explicit content
package means I can prove what's in it and where every piece came from, and refuse to build if
something isn't cleared yet.

The Generator also becomes its own little product. First it will create exercises from each lesson's
vocabulary and grammar. Later, translation, both grammatical and contextual.

## Why I couldn't just move two folders

Before designing anything, I had two AI agents (Codex and Claude) audit the repo separately. They
worked on a sealed copy through a small runner that keeps the evidence. The finding that mattered
most, roughly:

> You can't split this by moving two folders. Startup code, storage, contracts and services are
> shared, and each one needs an owner first.

In practice:

- one SQLite database holds reviews, the room, the notebook and the school progress;
- one content module pulls in annotation, storage, dictionary, exercises, generation, kanji,
  vocabulary and morphology;
- the spaced-repetition scheduler also feeds the 3D room.

I had pictured "two domains in one repo". The code was actually organised around data, pedagogy,
HTTP, storage and frontend. Without the audit I wouldn't have seen that gap.

## Before / after

```text
BEFORE                                   AFTER
one repository                           Generator (authoring, dev time only)
 ├─ game (3D room, school, review)        └─ analysis · dictionary · generation
 ├─ authoring tools + analyser               │ produces candidate sets
 ├─ dictionary                               ▼
 ├─ optional voice (extras/)             human review and approval
 └─ one database                             ▼
                                         NihonWorld (the game)
                                          ├─ owns the curriculum and the approvals
                                          ├─ builds a versioned content package
                                          ├─ shareable build = core + package
                                          └─ personal build  = core + package + extras
```

Content goes through five named steps: **LessonSource → LessonAuthoringBrief → CandidateSet →
ApprovedContent → ReleaseContentPackage.** Naming every step felt a bit bureaucratic at first, but
it made every discussion afterwards way more precise.

The migration is a chain of small phases: first a baseline, then A′ all the way to F. A phase only
closes when its checks pass, and then it gets a git tag. Twelve "architecture gates" define those
checks. The game keeps its repo and its history, and the Generator gets extracted with its own
history. Along the way I also decided both products will be English-only, which simplified more than
I expected.

## Agent diary

This is how the decision actually got made:

- **Audit.** Two agents audited the code separately, and the synthesis became the *Current
  Architecture* doc.
- **Proposal and reviews.** Claude reviewed the target architecture and the ADR, then ChatGPT did.
  Both came back with *accept with changes* and a numbered list. I decided every point, usually by
  answering numbered options like "1a 2a 3b".
- **A hard stop.** Every document had a final check that could only answer **READY** or
  **NOT READY**. Three of them came back NOT READY at least once before they passed.
- **Where the AI got it wrong (both ways):**
  - Claude wrote on a published page that each product owns the schemas it produces. That
    contradicted an accepted contract saying NihonWorld owns all of them. Claude caught it itself, two
    documents later, while reconciling everything. ChatGPT's review had missed it.
  - Claude added a safety check to the release process that created a new way to fail *after* a
    version tag that can't be changed. ChatGPT caught that one.
- **What I decided:** scope, every trade-off, every merge, every ticket I closed. The agents propose.
  Nothing counts as approved until I say so.

Having them audit each other is the whole point. That's how I avoid an AI greenlighting something
that isn't properly tested, or breaking stuff.

In the end: six design documents, an accepted ADR, and an epic with fourteen implementation tickets,
all before any refactoring.

## What I learned

- **Audit before you design.** What I thought the code looked like and what it actually looked like
  weren't the same.
- **An ADR records the decision, it doesn't make it.** The most useful part turned out to be the list
  of decisions I *postponed*, each one with an owner and a deadline.
- **Two models reviewing each other catch different things,** and both still miss some. Someone has
  to understand what they're signing off, and that someone is me.
- **READY / NOT READY makes reviews actually finish.** Without a clear verdict, a review can go on
  forever.

## Next

The first real step is the **baseline**: measure and back up the app as it is, before touching
anything. That's the next entry, along with whatever breaks on the way.
