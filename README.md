TikTok Clone — Infinite Vertical Snap-Feed
A full-screen, gesture-driven video interface designed to eliminate the friction of manual navigation in short-form video consumption. This project implements "mandatory" snapping physics to lock videos into the viewport, providing a seamless and immersive user experience.

🚀 Overview
Standard scrolling often requires "active navigation," which can increase cognitive load and break immersion. This repository addresses that by automating alignment and playback, targeting a "Perceived Effortlessness" that encourages higher engagement.

Key Problem Addressed
Active Navigation Friction: Users often spend 20% of session time just centering content in non-snapping feeds.
The Solution: A "mandatory" vertical snap-to-page scrolling engine that uses Intersection Observer logic to manage the video player's lifecycle.
✨ Features
Vertical Snap-to-Page Scrolling: Ensures videos lock perfectly into the viewport.
Instant Auto-Play: Videos begin playing immediately upon snapping to remove decisional load.
Resource Management: Only the visible video consumes system resources, optimized via the Intersection Observer API.
Persistent UI Overlays: Displays content metadata over the video feed.
Engagement Gestures: Includes a double-tap gesture for user interaction.
🛠️ Technical Stack
Framework: React / Next.js 
Styling: Tailwind CSS 
APIs: Intersection Observer API & CSS Scroll Snapping 
Video Hosting: Cloudinary or Mux (for low-latency streaming and auto-play) 
📊 Success Metrics
The project aims to achieve:
Reliability: 100% Snap-Accuracy.
Performance: < 300ms Playback Latency.
Engagement: A retention loop of 10+ videos per session.
👥 Contributors
Pape SY 
Duvall 
Date: February 14, 2026
