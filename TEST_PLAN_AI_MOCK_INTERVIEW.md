# AI Mock Interview Platform - Test Plan & Test Cases

## Executive Summary

This document outlines the comprehensive test strategy for the **AI Mock Interview Platform** feature in Careerflow. This feature allows users to:
- Practice job interview questions
- Receive AI-generated feedback on their answers
- Track improvement over time

**Test Plan Scope:** Functional, integration, edge cases, regression, and AI feedback quality testing

---

## 1. Test Plan Overview

### 1.1 Feature Context
The AI Mock Interview Platform is a critical user-facing feature that combines:
- **User interaction layer** - Interview question selection, answer recording/submission
- **AI processing layer** - Feedback generation using language models
- **Data persistence layer** - Storing interviews, feedback, and user progress
- **Analytics layer** - Progress tracking and improvement metrics

### 1.2 Testing Scope
| Area | Scope |
|------|-------|
| **Functional Testing** | Feature workflows, user flows, CRUD operations |
| **Integration Testing** | API communication, database persistence, AI service integration |
| **Edge Cases** | Empty inputs, network failures, timeout scenarios |
| **Regression Testing** | Existing features not broken by this feature |
| **AI Quality Testing** | Feedback relevance, consistency, accuracy |
| **Performance Testing** | Response times, concurrent users, data load handling |
| **Security Testing** | Input validation, data privacy, API authentication |

### 1.3 Test Environment
- **URL:** `https://www.careerflow.ai/mock-interview` (or applicable endpoint)
- **Browsers:** Chrome, Firefox, Safari (desktop + mobile)
- **Test Data:** Seeded test accounts, predefined interview questions

---

## 2. Risks & Assumptions

### 2.1 Critical Assumptions (Absence of Full PRD)

| # | Assumption | Impact | Mitigation |
|---|-----------|--------|-----------|
| A1 | AI feedback is generated asynchronously (not real-time blocking) | Test needs to handle async waits | Configure appropriate timeouts; use polling/webhooks |
| A2 | Interview questions are pre-loaded from database (not dynamically generated) | Test data setup required | Seed test database with standard interview questions |
| A3 | Users can re-take the same interview question multiple times | Affects test isolation and data cleanup | Track interview attempt counts in test teardown |
| A4 | Feedback is personalized based on job role/level selected | Need to validate contextual feedback | Create test cases for different roles (Junior, Mid, Senior) |
| A5 | User progress/improvement tracking is based on score aggregation | Historical data impacts comparison | Reset user progress between test runs |

### 2.2 Key Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **R1: AI Output Inconsistency** | High | Feedback varies for identical answers; hard to test deterministically | Implement feedback quality rules; create baseline responses |
| **R2: API Rate Limiting** | Medium | AI service rate limits could cause test timeouts/failures | Implement exponential backoff; use test API key with higher limits |
| **R3: Data Privacy Violation** | High | Storing user answers might contain sensitive info (personal stories, salary data) | Implement data masking/encryption; compliance audit required |
| **R4: Model Hallucination** | Medium | AI generates incorrect/nonsensical feedback | Implement output validation; set up monitoring for suspicious feedback |
| **R5: Network Latency** | Medium | Slow AI service responses cause user experience issues | Set performance SLAs (e.g., feedback within 10s); implement caching |
| **R6: Regression in Existing Features** | Medium | Interview platform breaks existing profile/resume features | Run full regression suite; prioritize smoke tests |

---

## 3. Test Cases

### 3.1 Test Case Table

| Test ID | Category | Description | Preconditions | Steps | Expected Result | Priority | Status |
|---------|----------|-------------|---------------|-------|-----------------|----------|--------|
| **TC-AI-001** | **Functional** | User can initiate a mock interview | User logged in; Interview questions available in DB | 1. Navigate to Mock Interview page<br>2. Select job role (e.g., "Software Engineer")<br>3. Select experience level (e.g., "Mid-level")<br>4. Click "Start Interview" | Interview question #1 displayed with clear instructions | **CRITICAL** | Not Started |
| **TC-AI-002** | **Functional** | User can submit an answer and receive AI feedback | User in active interview session; Question displayed | 1. Read interview question<br>2. Type/record answer<br>3. Click "Submit Answer"<br>4. Wait for AI feedback | Feedback displayed within 15 seconds; contains constructive comments and score (0-100) | **CRITICAL** | Not Started |
| **TC-AI-003** | **Functional** | User can navigate to next interview question | User has submitted answer; Feedback displayed | 1. Review feedback on current question<br>2. Click "Next Question" button | New interview question (#2) loads; feedback cleared from view | **CRITICAL** | Not Started |
| **TC-AI-004** | **Functional** | User can review previous interview answers and feedback | User completed interview; has stored interview history | 1. Navigate to "Past Interviews" section<br>2. Select a completed interview<br>3. Click on a specific question | Answer and feedback displayed for review; ability to compare across attempts | **HIGH** | Not Started |
| **TC-AI-005** | **Functional** | User progress/improvement is tracked over multiple interviews | User completed 2+ interviews on same role | 1. Complete Interview #1 (avg score: 65)<br>2. Complete Interview #2 on same role (avg score: 75)<br>3. Navigate to "Progress" dashboard | Progress chart shows upward trend; improvement percentage displayed (e.g., +15%) | **HIGH** | Not Started |
| **TC-AI-006** | **Integration** | AI feedback is generated from external API | User submits answer; API credentials valid | 1. Submit answer to mock question<br>2. Monitor network requests (DevTools)<br>3. Verify API call to AI service (e.g., OpenAI/Claude API)<br>4. Confirm response contains feedback object | API call succeeds; response includes feedback text, score, suggestions array | **HIGH** | Not Started |
| **TC-AI-007** | **Integration** | User interview data is persisted to database | User submits answer | 1. Submit interview answer<br>2. Query database for stored interview record<br>3. Verify record contains: user_id, question_id, answer_text, feedback, timestamp | Database record exists with all required fields; data matches submitted content | **HIGH** | Not Started |
| **TC-AI-008** | **Edge Case** | User cannot submit empty answer | User on interview question | 1. Leave answer field blank<br>2. Click "Submit Answer"<br>3. Observe submit button state | Error message displayed: "Answer cannot be empty"; Submit button disabled until text entered | **MEDIUM** | Not Started |
| **TC-AI-009** | **Edge Case** | User can submit very long answer (>5000 chars) | User typing response | 1. Paste long text (5000+ characters) into answer field<br>2. Click "Submit Answer"<br>3. Monitor submission time | Answer submitted successfully; feedback generated; performance remains acceptable (<20s) | **MEDIUM** | Not Started |
| **TC-AI-010** | **Edge Case** | Network timeout during AI feedback generation | API service delayed/unresponsive | 1. Submit answer<br>2. Simulate network delay (throttle to "Slow 3G")<br>3. Wait for feedback timeout<br>4. Observe error handling | Timeout error displayed after 30s; "Retry" button offered; user can continue without losing answer | **HIGH** | Not Started |
| **TC-AI-011** | **Edge Case** | User session expires during interview | User idle for >30 minutes in interview | 1. Start interview<br>2. Wait 30+ minutes (or simulate session expiration)<br>3. Attempt to submit answer | Session expired message; option to re-login; interview progress saved | **MEDIUM** | Not Started |
| **TC-AI-012** | **AI Quality** | AI feedback is relevant to the question asked | User answers question: "Tell us about a conflict with a team member" | 1. Submit thoughtful answer<br>2. Receive AI feedback<br>3. Analyze feedback content | Feedback addresses conflict resolution, communication, teamwork; not generic; mentions keywords from answer | **CRITICAL** | Not Started |
| **TC-AI-013** | **AI Quality** | AI feedback is constructive and actionable | User submits mediocre answer | 1. Submit average-quality answer (e.g., vague response)<br>2. Receive feedback<br>3. Analyze suggestions | Feedback includes: specific areas to improve, example phrases to use, structure recommendations | **HIGH** | Not Started |
| **TC-AI-014** | **AI Quality** | AI feedback scores are consistent for similar answers | User A answers Q1 with answer_v1; User B answers same Q1 with answer_v1 (same text) | 1. User A submits answer<br>2. Record feedback score (e.g., 78)<br>3. User B submits identical answer<br>4. Compare feedback scores | Scores within ±5% variance (deterministic for identical inputs) | **MEDIUM** | Not Started |
| **TC-AI-015** | **Regression** | Existing user profile features not broken | User profile page exists; other features functional | 1. Log in<br>2. Navigate to Profile page<br>3. Update profile information<br>4. Navigate to Mock Interview<br>5. Complete interview<br>6. Return to Profile | Profile data unchanged; all CRUD operations still work; no console errors | **HIGH** | Not Started |
| **TC-AI-016** | **Performance** | Interview page loads within acceptable time | User logged in; browser cache cleared | 1. Clear browser cache<br>2. Navigate to Mock Interview page<br>3. Measure Time to First Contentful Paint (FCP)<br>4. Measure Time to Interactive (TTI) | FCP < 2s; TTI < 5s; no janky animations | **MEDIUM** | Not Started |
| **TC-AI-017** | **Performance** | AI feedback generated within SLA | User submits well-formed answer | 1. Submit answer<br>2. Start timer<br>3. Wait for feedback response<br>4. Stop timer | Feedback received within 10-15 seconds for 95th percentile; <30s for 99th percentile | **HIGH** | Not Started |

---

## 4. Critical Test Cases Analysis

### 4.1 Top 3 Critical Test Cases

#### **TC-AI-001: User can initiate a mock interview**
**Why Critical:**
- **User Journey Entry Point** - If users can't start an interview, the feature is unusable
- **Foundation for All Other Tests** - All subsequent tests depend on this working
- **Business Impact** - Blocks core feature value delivery
- **Scope:** Navigation, button functionality, state management

---

#### **TC-AI-002: User can submit an answer and receive AI feedback**
**Why Critical:**
- **Core Feature Value** - AI feedback is the primary value proposition
- **Integration Point** - Exercises entire flow: UI → API → AI Service → Database → UI
- **Quality Gate** - If feedback generation fails/times out, feature fails completely
- **Risk Mitigation** - Catches API integration issues, performance problems, and data flow issues early
- **Scope:** Form submission, async operations, API integration, error handling

---

#### **TC-AI-012: AI feedback is relevant to the question asked**
**Why Critical:**
- **Quality Assurance for AI Output** - Users will abandon feature if feedback is generic/irrelevant
- **Differentiator vs. Competitors** - Careerflow's value depends on high-quality, contextual feedback
- **User Trust** - Irrelevant feedback damages brand credibility
- **Regression Detection** - AI model changes/degradation immediately visible
- **Scope:** NLP/semantics, model quality, output validation

---

### 4.2 Test Case Execution Priority

```
Tier 1 (Run First - Smoke Test):
├── TC-AI-001 (Initiate interview)
├── TC-AI-002 (Submit answer + receive feedback)
└── TC-AI-003 (Next question navigation)

Tier 2 (Core Functional):
├── TC-AI-004 (Review past interviews)
├── TC-AI-005 (Track progress)
├── TC-AI-012 (AI feedback relevance)
└── TC-AI-017 (Performance SLA)

Tier 3 (Integration & Edge Cases):
├── TC-AI-006 (API integration)
├── TC-AI-007 (Database persistence)
├── TC-AI-008 through TC-AI-011 (Edge cases)
└── TC-AI-013 through TC-AI-014 (AI quality)

Tier 4 (Regression):
└── TC-AI-015 (No regression in existing features)
```

---

## 5. AI Feedback Quality Testing

### 5.1 What Does "Good AI Output" Mean in QA Context?

**Good AI feedback exhibits:**

| Criterion | Definition | Test Method |
|-----------|-----------|-------------|
| **Relevance** | Feedback addresses the specific question and user's actual answer | Manual review + semantic similarity scoring (compare answer keywords to feedback) |
| **Specificity** | Feedback references actual phrases/points from user answer | Parse feedback for pronouns/references; verify they match answer content |
| **Constructiveness** | Feedback provides actionable improvement suggestions, not just criticism | NLP analysis: detect presence of "consider", "try", "next time"; count improvement suggestions |
| **Accuracy** | Feedback doesn't contain factually incorrect statements | Domain expert review; flag contradictions with interview best practices |
| **Consistency** | Identical inputs produce identical outputs; similar inputs produce similar scores | Run same question 5 times; compare scores (should be deterministic) |
| **Comprehensiveness** | Feedback covers multiple dimensions (clarity, structure, content, delivery) | Word count analysis; presence of multiple feedback categories |
| **Tone** | Feedback is encouraging/neutral, not harsh or demoralizing | Sentiment analysis; manual review for discouraging language |
| **Length** | Feedback is neither too brief nor overwhelming | Word count: 100-300 words optimal; flag if <50 or >500 |

### 5.2 AI Quality Test Cases

#### **TC-AI-Q1: Feedback Relevance Check**
```
Test Method: Semantic Similarity Scoring
Input: User answer to "Tell us about a time you led a project"
User's answer mentions: "Python project", "3-month timeline", "agile methodology", "team of 5"

Expected: Feedback discusses project leadership, agile/timeline management, team coordination
Validation: Use embedding similarity (e.g., OpenAI embeddings) to score feedback relevance
Pass Threshold: Semantic similarity > 0.75
```

#### **TC-AI-Q2: Feedback Instruction-Following**
```
Test Method: Rule-Based Validation
Input: Question is about "Conflict with a peer"
Expected Pattern: Feedback should mention {communication, conflict resolution, teamwork}

Validation Script:
- Tokenize feedback
- Check for keywords: "conflict", "communication", "resolution", "team", "perspective"
- Flag if <2 of 5 keywords present

Pass Threshold: ≥3 relevant keywords found
```

#### **TC-AI-Q3: Consistency Test**
```
Test Method: Deterministic Hashing
Input (Run 1): "I led a cross-functional team of 5 to deliver a mobile app in 3 months"
Output (Run 1): Score = 82, Feedback = "[feedback text]"

Input (Run 2): Same text as Run 1
Output (Run 2): Score = 82 (±2 tolerance), Feedback = "[same/similar text]"

Pass Threshold: Score variance < 5%, Feedback similarity > 0.90
```

#### **TC-AI-Q4: Inappropriate Content Detection**
```
Test Method: Content Filtering
Input: User answer containing discriminatory/offensive language
Expected: AI feedback appropriately addresses the concern without amplifying it

Validation:
- Flag if feedback repeats offensive content
- Verify feedback is professional and constructive
- Check that system logs the incident for review

Pass: Feedback is constructive, doesn't amplify offensive content
```

### 5.3 AI Output Validation Checklist

**Before accepting AI feedback in production, validate:**

- [ ] **Relevance Score > 0.75** (semantic similarity to question + answer)
- [ ] **Readability Score > 0.60** (Flesch-Kincaid grade level 6-10)
- [ ] **Word Count 100-300** (not too brief, not overwhelming)
- [ ] **Contains ≥2 Actionable Items** (suggestions, improvements, next steps)
- [ ] **Sentiment Score > 0** (neutral to positive, not discouraging)
- [ ] **No Factual Errors** (domain expert spot-check on sample)
- [ ] **Consistency Check Passed** (deterministic for identical inputs)
- [ ] **No PII Leakage** (feedback doesn't repeat sensitive user data)

---

## 6. Test Execution Strategy

### 6.1 Test Automation Approach

**Automated Tests (Using Playwright):**
- ✅ TC-AI-001, TC-AI-003, TC-AI-004, TC-AI-008, TC-AI-009, TC-AI-010, TC-AI-011, TC-AI-015, TC-AI-016, TC-AI-017

**Manual Tests (Domain Expert Review):**
- ✅ TC-AI-002 (first run - validates AI integration)
- ✅ TC-AI-012, TC-AI-013, TC-AI-014 (AI quality assessment)
- ✅ TC-AI-Q1 through TC-AI-Q4 (AI output quality)

**Hybrid Tests (Automation + Manual Validation):**
- ✅ TC-AI-005 (automation checks progress UI; manual verifies correctness of calculations)
- ✅ TC-AI-006, TC-AI-007 (API calls automated; manual DB verification)

### 6.2 Test Execution Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Setup** | Day 1 | Test environment provisioning, test data seeding, test account creation |
| **Smoke Testing** | Day 1-2 | TC-AI-001, TC-AI-002, TC-AI-003, TC-AI-012 |
| **Functional Testing** | Day 2-3 | TC-AI-004 through TC-AI-011, TC-AI-013-TC-AI-014 |
| **Integration Testing** | Day 3 | TC-AI-006, TC-AI-007, TC-AI-Q1-TC-AI-Q4 |
| **Performance Testing** | Day 3 | TC-AI-016, TC-AI-017 with load simulation |
| **Regression Testing** | Day 3-4 | TC-AI-015 (full suite) |
| **Reporting** | Day 4 | Test report, risk assessment, go/no-go recommendation |

---

## 7. Test Data Requirements

### 7.1 Seeded Test Data

**Interview Questions (Pre-loaded):**
```
Q1: "Tell us about a time you led a team project"
Q2: "Describe a situation where you resolved a conflict"
Q3: "How do you approach learning new technologies?"
Q4: "Tell us about your biggest failure and what you learned"
Q5: "How do you prioritize competing tasks?"
```

**Test Users:**
```
- user_test_junior@careerflow.ai (role: Junior, 0-2 years experience)
- user_test_mid@careerflow.ai (role: Mid-level, 2-5 years experience)
- user_test_senior@careerflow.ai (role: Senior, 5+ years experience)
```

**Sample Answers (for baseline AI feedback testing):**
```
Strong Answer: "I led a cross-functional team of 8 engineers on a mobile app project. 
I established clear milestones, conducted weekly syncs, and successfully delivered 2 weeks ahead of schedule."

Weak Answer: "I worked on a project with my team."

Edge Case: [5000+ character very long response]
```

---

## 8. Success Criteria & Go/No-Go Decision

### 8.1 Pass/Fail Criteria

| Category | Criteria | Status |
|----------|----------|--------|
| **Smoke Tests** | All 3 critical tests pass | ⏳ |
| **Functional Tests** | ≥90% of TC-AI-001 through TC-AI-011 pass | ⏳ |
| **AI Quality** | TC-AI-012 passes; feedback relevance > 0.75 | ⏳ |
| **Integration** | TC-AI-006, TC-AI-007 pass; zero API failures | ⏳ |
| **Performance** | TC-AI-017: 95th percentile < 15s; no page timeouts | ⏳ |
| **Regression** | TC-AI-015 passes; no new bugs in existing features | ⏳ |
| **Security** | No PII leakage in AI feedback; input validation confirmed | ⏳ |

### 8.2 Go/No-Go Recommendation

**GO Criteria:**
- ✅ All critical tests pass (TC-AI-001, TC-AI-002, TC-AI-012)
- ✅ No P0/P1 bugs identified
- ✅ AI feedback quality validated by domain expert
- ✅ Performance within SLA
- ✅ No regression in existing features

**NO-GO Criteria:**
- ❌ Any critical test fails
- ❌ AI feedback relevance < 0.60
- ❌ Unresolved security/privacy issues
- ❌ Performance > 30s for 50th percentile
- ❌ Regression detected in core features

---

## 9. Risk Mitigation & Contingencies

### 9.1 If AI Feedback Quality is Poor (TC-AI-012 Fails)

| Risk | Contingency |
|------|-------------|
| Relevance scores < 0.60 | Halt production release; escalate to ML team for model retraining |
| Feedback too generic | Implement feedback templates with variable injection instead of pure generative AI |
| Consistency issues | Switch to deterministic feedback generation (rule-based + examples) |

### 9.2 If API Integration Fails (TC-AI-006 Fails)

| Risk | Contingency |
|------|-------------|
| API rate limits | Implement queue system; batch feedback generation during off-peak hours |
| Timeout errors | Increase timeout threshold; implement async processing with email notifications |
| Service unavailable | Fallback to template-based feedback; alert user that AI is temporarily unavailable |

### 9.3 If Performance is Poor (TC-AI-017 Fails)

| Risk | Contingency |
|------|-------------|
| Feedback > 30s | Implement caching; use lightweight model or prompt optimization |
| High latency | Offload to background job; show "Feedback generating..." placeholder |
| Database bottleneck | Add caching layer (Redis); optimize interview queries |

---

## 10. Sign-Off & Approval

| Role | Approval | Date | Notes |
|------|----------|------|-------|
| QA Lead | ⏳ | TBD | Test plan review |
| Product Manager | ⏳ | TBD | Requirement alignment |
| Engineering Lead | ⏳ | TBD | Technical feasibility |
| Security/Compliance | ⏳ | TBD | Data privacy review |

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **POM** | Page Object Model - design pattern for organizing UI test code |
| **SLA** | Service Level Agreement - performance targets |
| **TTI** | Time to Interactive - performance metric |
| **FCP** | First Contentful Paint - performance metric |
| **PII** | Personally Identifiable Information |
| **NLP** | Natural Language Processing |
| **Semantic Similarity** | Measure of how similar two text snippets are in meaning |

---

**Document Version:** 1.0  
**Last Updated:** May 14, 2026  
**Created By:** QA Automation Engineer  
**Next Review:** Upon feature completion
