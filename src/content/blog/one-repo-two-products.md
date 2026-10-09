---
title: "One repo, two products: why I'm splitting NihonWorld before adding features"
description: "Why NihonWorld is becoming two projects, and how three AIs and I made the decision."
date: 2026-10-08
series: "Devlog #1"
tags: [nihonworld, architecture, adr, ai-agents]
topics: [nihonworld, generator]
revision: Rewritten on 2026-10-09 to make it shorter.
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

NihonWorld is a Japanese tutor you play. You don't walk around a 3D world: every place is a diorama,
a small scene you look into and interact with, like your room or the school, and later places where
you talk to people. That's also why this devlog is full of dioramas. Right now they're all grey
boxes, and that's on purpose: I want the learning part to work before anything looks pretty.

This week I didn't add a single feature. I spent four days deciding how to split the project in
two, and I didn't touch the code until the plan was done. Here's why, and how three AIs and I got
there.

## The rule everything hangs on

> **Pedagogy is deterministic. The LLM is an actor that gets told what to do.**

In plain words: normal code decides what you learn, when you review it and whether your answer was
right. The AI can improvise a little scene with the words it's given, but it never decides anything
about your learning.

And it's not just a nice sentence in a document. If a change breaks that rule, the project refuses
it before it gets in.

## One project doing two jobs

NihonWorld was doing two very different things at once: being the game, and being the workshop
where lessons get made (analysing sentences, looking words up, generating exercises). If you've used
Unity, picture shipping your game with the level editor glued inside it.

<figure class="explain">
  <figcaption class="explain-h"><span>EXPLAINER</span><span>ONE PROJECT VS TWO</span></figcaption>
  <div class="explain-body explain-grid">
    <div class="explain-col">
      <b>Before: one project</b>
      <div class="repo">
        <span class="repo-name">nihonworld/</span>
        <span class="chip pink">The game</span>
        <span class="chip mint">The lesson workshop</span>
        <span class="chip grey">One shared database and shared code</span>
      </div>
      <p>Everything can touch everything. Change a tool, and the game might break.</p>
    </div>
    <div class="explain-col">
      <b>After: two projects</b>
      <div class="flow">
        <div class="repo"><span class="repo-name">generator/</span><span class="chip mint">Proposes content</span></div>
        <span class="arrow">approved<br />package</span>
        <div class="repo"><span class="repo-name">nihonworld/</span><span class="chip pink">Approved only</span></div>
      </div>
      <p>The game never depends on the workshop. Content only crosses one way, after I've reviewed it.</p>
    </div>
  </div>
</figure>

## Why it's worth the trouble

- **I want two builds.** One I can share with other people someday, and one for myself, to
  experiment with AI conversation and voice.
- **Nothing generated reaches a player without my OK.** The Generator proposes, I review, and only
  approved content gets into the game, locked with a fingerprint so it can't change behind my back.
- **Licences.** Everything in a build I share has to be cleared, so I need to know exactly what's
  inside and where each piece came from.

<figure class="explain">
  <figcaption class="explain-h"><span>EXPLAINER</span><span>TWO BUILDS, ONE GAME</span></figcaption>
  <div class="explain-body builds">
    <div class="build">
      <b>The shareable build</b>
      <ul>
        <li>Every sentence and exercise made ahead of time, reviewed and frozen</li>
        <li>Audio recorded in advance</li>
        <li>No live AI at all</li>
      </ul>
      <div class="sum">= game + approved content</div>
    </div>
    <div class="build">
      <b>My personal build</b>
      <ul>
        <li>Everything above, plus my experiments</li>
        <li>A local AI model for conversation (gigabytes, and a decent GPU)</li>
        <li>A voice engine I'm not allowed to redistribute</li>
      </ul>
      <div class="sum">= game + approved content + extras</div>
    </div>
  </div>
</figure>

## Easier said than done

My first idea was "move a couple of folders and done". Spoiler: no.

Before designing anything, I had two AIs (Codex and Claude) audit the code separately, and they came
back with the same bad news. One database held everything: reviews, the room, the notebook, school
progress. One big content module touched half the project. Even the review scheduler was feeding the
room's diorama. Each of those pieces needed an owner before anything could move.

That was the most useful lesson of the week: what I thought the code looked like and what it
actually looked like weren't the same.

## How the decision got made

Think of the AIs as workers, each with their own job. After the audit, Claude and ChatGPT each
reviewed the plan and came back with a numbered list of changes, and I decided every point, usually
by answering options like "1a 2a 3b". Every document ended with a check that could only say
**READY** or **NOT READY**, and three of them got a NOT READY at least once before passing.

They also got things wrong, which is exactly why they review each other. Claude once wrote something
on a published page that contradicted a decision we had already accepted, and caught it itself two
documents later. ChatGPT had missed it. Another time, ChatGPT caught a check Claude had added that
could fail after a release was already locked.

Two reviewers catch different things, and both still miss some. Someone has to understand what
they're signing off, and that someone is me.

## Where it ended

Four days, six design documents, one accepted decision record, and fourteen small tasks lined up in
order, all before touching the code. Now comes the actual split, one small phase at a time, and a
phase only counts as done when its checks pass. I'll tell you how it goes, including what breaks.
