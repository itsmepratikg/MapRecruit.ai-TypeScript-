# Business Requirements Document (BRD) - MapRecruit ATS

## 1. Executive Summary
MapRecruit ATS is positioned as a next-generation "AI-First" Applicant Tracking System. The business objective is to reduce manual administrative overhead for recruiters by 40% through automation and AI-driven insights, while improving the candidate experience through modern, responsive interfaces.

## 2. Business Goals & Objectives

### 2.1. Operational Efficiency
- **Goal**: Reduce time-to-hire by automating screening and scheduling.
- **Metric**: Decrease "Time in Stage" for Screening by 50%.
- **Mechanism**: AI Match Scoring and Workflow Automation.

### 2.2. Smarter Decision Making
- **Goal**: Improve quality of hire.
- **Metric**: Increase 6-month retention rate of hired candidates.
- **Mechanism**: Data-driven "Match AI" radar charts and skill gap analysis to identify best-fit candidates objectively.

### 2.3. User Experience
- **Goal**: Zero training required for new users.
- **Metric**: System Usability Scale (SUS) score > 80.
- **Mechanism**: Intuitive "Drag-and-Drop" dashboard, Natural Language Search, and "One-Click" actions.

## 3. Stakeholder Analysis

### 3.1. Primary Users (Recruiters)
- **Needs**: Speed, accuracy, and minimizing context switching.
- **Pain Points**: Switching between Email, Calendar, and Excel.
- **Solution**: Unified Inbox, integrated Calendar, and in-app Workflow Builder.

### 3.2. Secondary Users (Hiring Managers)
- **Needs**: Quick visibility into candidate quality without learning a complex tool.
- **Solution**: "Match Score" summaries and simplified "Interview Panel" mode.

### 3.3. Administrators
- **Needs**: Control over data access and system configuration.
- **Solution**: Granular Role-Based Access Control (RBAC) and client partitioning.

## 4. Functional Requirements (High Level)

| Feature Area | Business Requirement | Priority |
| :--- | :--- | :--- |
| **Identity** | Secure, seamless access with support for multiple client environments. | High |
| **Search** | Ability to find talent in < 2 seconds using complex boolean logic or simple semantic queries. | Critical |
| **Campaigns** | End-to-end lifecycle management of a job requisition, from sourcing to offer. | Critical |
| **Intelligence** | Real-time visibility into funnel health to identify bottlenecks immediately. | High |
| **Mobility** | Full functionality available on mobile devices for recruiters on-the-go. | Medium |

## 5. Non-Functional Requirements

### 5.1. Performance
- **Load Time**: Dashboard must load in < 1.5 seconds.
- **Search Latency**: Search results must appear in < 500ms.

### 5.2. Usability
- **Accessibility**: WCAG 2.1 AA compliance for color contrast and screen reader support.
- **Responsiveness**: Fluid layout adaptation from 320px to 4k resolutions.

### 5.3. Reliability
- **Uptime**: 99.9% availability during business hours.
- **Data Integrity**: Zero data loss during workflow transitions.
