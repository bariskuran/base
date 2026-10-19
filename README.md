# @bariskuran/base

**A comprehensive React framework, UI library, and design system.**

## Installation

### Automatic Setup

To create a new project with Base:

```bash
npx @bariskuran/create-base
```

### Manual Installation

To add Base to an existing React project:

**npm**

```bash
npm install @bariskuran/base
```

**Yarn**

```bash
yarn add @bariskuran/base
```

### Getting Started

Once the automatic setup is complete, start the development server:

```bash
yarn start
```

The application runs at `http://localhost:3000` by default.

The integrated Design System is available at `http://localhost:3000/design-system`.

## Purpose

Base is a comprehensive, largely self-contained development framework that brings together the essential tools, systems, and UI components needed to build modern React applications.

With over 100 utility functions, React hooks, and UI components, Base covers a wide range of development needs, from icons and flags to data handling, state management, date and time utilities, and image management.

**Base is not a collection of third-party libraries bundled together.** Its core systems and components are developed entirely in-house, following a unified architecture. The only third-party library used within Base's own functional modules is the Lottie animation engine.

Instead of installing, configuring, integrating, and maintaining numerous independent packages for common development tasks, Base provides a cohesive and consistent environment.

Its purpose goes beyond simplifying project setup: **Base aims to provide the shared infrastructure, tools, and components that React applications need, all within a single, standardized ecosystem.**

## Features

### Core Libraries & Systems

Base provides built-in solutions for many features that would otherwise require separate third-party dependencies.

- **UI Components & Templates:** Reusable interface components and ready-to-use UI templates.
- **Icons & Flags:** Built-in icon and country flag libraries.
- **Fetch & Data Management:** Tools for API requests and data handling.
- **State Management:** An integrated system for managing application state.
- **CSS & Styling Utilities:** Utilities for styling, design variables, and CSS operations.
- **Date & Time:** Functions for date, time, and time-related calculations.
- **Image Management:** Tools for image processing and management.
- **Timers:** Utilities for timers and time-based operations.
- **React Hooks:** Custom hooks for reusable React behaviors and application logic.
- **Utility Functions:** General-purpose functions for everyday development tasks.
- **Animations:** Lottie-based animation support.

These are not unrelated solutions assembled into a single package. They are interconnected parts of a unified library, built around a consistent development philosophy.

### UI & Design System

Base provides more than functional utilities. It also establishes a shared visual language and a consistent standard for interface development.

Components, UI templates, styles, and design rules are developed within the same system, making it easier to create consistent interfaces across different projects.

### Ready-to-Use Project Infrastructure

Starting a React project may take only a few commands, but preparing a complete development environment can take days.

Setting up the project architecture, routing, styling system, icons, shared components, development tools, and configurations is often a repetitive process.

Base provides this infrastructure out of the box.

A project structure built on the latest React, React DOM, React Router DOM, and Vite comes with the necessary development configurations, design system, and application integrations already in place.

**This allows you to focus on building your application instead of spending time on initial setup.**

## Design System

Base includes an integrated **Design System** environment where components, functions, and hooks can be explored, tested, and documented through their APIs.

It serves both as a documentation resource and as a live development and testing environment.

After automatic setup, it is accessible at:

**http://localhost:3000/design-system**

## Development Philosophy

Base was built around the idea of solving common development needs within its own architecture rather than introducing a new dependency for every feature.

This approach is guided by three core principles:

**Independence.** Keeping third-party dependencies to a minimum while maintaining full control over the core systems.

**Consistency.** Bringing functions, utilities, and UI components together under a shared development standard.

**Efficiency.** Reducing repetitive infrastructure work and accelerating the development process.

Base is designed not just to help you start a project, but to **provide a shared development foundation throughout the entire application lifecycle.**
