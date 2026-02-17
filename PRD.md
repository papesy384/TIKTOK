PRD

Project: TikTok Clone — Infinite Vertical Snap-Feed
Owner: Pape & Duvall
Date: February 14, 2026
Problem
Individual users need a way to consume short-form video content without the friction of manual navigation. Standard scrolling requires "active navigation" (finding, clicking, aligning), which increases cognitive load and breaks user immersion. This leads to lower completion rates and shorter session lengths compared to the "effortless" snapping feeds users expect.
Supporting Context:
User pain point: Users spend 20% of session time just centering content in non-snapping feeds.
Market insight: TikTok's success is rooted in "Perceived Effortlessness"—the removal of decisional load via auto-play.
Proposed Solution
We are building a full-screen, gesture-driven video interface that uses "mandatory" snapping physics to lock videos into the viewport. The core engine uses Intersection Observer logic to manage the lifecycle of the video player, ensuring only the visible video consumes resources.
Success Metrics
Reliability: 100% Snap-Accuracy
Performance: < 300ms Playback Latency
Engagement: 10+ Videos/Session Retention Loop
Requirements (P0 Priority)
Vertical snap-to-page scrolling.
Instant auto-play upon snapping.
Persistent UI overlays for content metadata.
Double-tap gesture for engagement.



Technical Approach (The "How") 

The build uses a React/Next.js framework paired with Tailwind CSS for the UI, leveraging the Intersection Observer API for resource management and CSS Scroll Snapping for the "mandatory" vertical locking. Video hosting is handled via Cloudinary or Mux to ensure low-latency streaming and auto-play performance.

Why Build This Now? (The "Why")
Current "active navigation" feeds waste 20% of user session time just on centering content; this feature eliminates that friction by automating alignment and playback, directly targeting a 10+ video-per-session retention loop through "effortless" consumption.


