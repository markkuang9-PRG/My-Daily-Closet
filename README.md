# 🧥 My Daily Closet

> **From "Piled-up Clothes" to "Liquid Assets".**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🌟 The Vision

The fundamental problem with modern wardrobes isn't a lack of clothes, but a lack of **inventory management** and **styling guidance**. Millions of dollars of clothing sit idle in closets worldwide, causing decision fatigue and massive retail return rates.

**My Daily Closet** is an open-source, AI-driven wardrobe manager designed to solve this. We are building a closed-loop ecosystem for your clothes: **Style -> Buy -> Sell/Donate/Upcycle**. 

By treating personal clothing as manageable inventory, we aim to eliminate decision fatigue, reduce fashion waste, and create a seamless pipeline for the circular fashion economy.

## ✨ Core Features

1. **🚀 30-Second Digitization**
   - Upload a photo, and our Multimodal AI (powered by Gemini) automatically tags the category, color, style, and season.
   - Say goodbye to tedious manual data entry.

2. **🤖 Context-Aware AI Stylist**
   - Generates daily outfit recommendations based on your actual wardrobe inventory and real-time local weather data.
   - Provides personalized styling advice, ensuring you wear more of what you own.

3. **💸 Idle Asset Monetization**
   - Automatically detects clothes that have been unworn for 90+ days.
   - Features a one-click generator for highly-converting sales copy, ready to be pasted into marketplaces like Poshmark, eBay, or Depop.
   - Turns idle wardrobe space back into liquid cash.

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS, Motion (Framer Motion)
- **Backend/BaaS:** Firebase (Authentication, Firestore)
- **AI Engine:** Google Gemini 2.5 Flash (Multimodal)
- **APIs:** Open-Meteo (Real-time weather integration)

## 🤝 Why Open Source?

We believe that managing personal assets should be transparent and community-driven. By open-sourcing the core framework, we invite developers, fashion enthusiasts, and AI researchers globally to collaborate. 

We welcome contributions to:
- Build better background-removal and image processing algorithms.
- Integrate with local second-hand marketplaces worldwide via APIs.
- Create more personalized and diverse AI styling prompts.

## 🧭 Where Contributors Should Start

If you are evaluating whether to contribute, start here:

- [ROADMAP.md](ROADMAP.md) for current priorities
- [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md) for concrete first contributions
- [ISSUE_BACKLOG.md](ISSUE_BACKLOG.md) for ready-to-post community issue drafts
- [CONTRIBUTING.md](CONTRIBUTING.md) for contribution process and legal terms

The project is currently most receptive to focused improvements around MVP stabilization, workflow cleanup, Firebase reliability, prompt quality, and contributor-facing documentation.

## ⚖️ Licensing

- The source code in this repository is licensed under **AGPL-3.0-only**. See [LICENSE](LICENSE).
- Additional attribution and repository notices are collected in [NOTICE](NOTICE).
- External contributions are accepted under the terms in [CLA.md](CLA.md). This allows the project to remain open source while preserving the ability to offer commercial licenses, dual-license future versions, or complete a broader business transaction involving the project.
- Project names, logos, and brand assets are not automatically licensed with the source code. See [TRADEMARKS.md](TRADEMARKS.md).
- Project governance, maintainer authority, and contribution boundaries are described in [GOVERNANCE.md](GOVERNANCE.md).
- Community behavior expectations are described in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Private security reporting guidance is described in [SECURITY.md](SECURITY.md).
- Commercial licensing and private business inquiries are described in [COMMERCIAL-LICENSING.md](COMMERCIAL-LICENSING.md).
- Support paths are described in [SUPPORT.md](SUPPORT.md).

For commercial licensing, OEM use, private deployments that need terms outside AGPL, or other business inquiries, contact the project owner before use.

## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/markkuang9-PRG/My-Daily-Closet.git

# Install dependencies
npm install

# Set up your .env file with your Gemini API Key
# VITE_GEMINI_API_KEY=your_key_here

# Run the development server
npm run dev
\`\`\`

---
Copyright (c) 2026 Piedra Roja Group, Inc. and contributors.
