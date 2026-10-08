# まなび環境ラボ - Product Specification

## 1. Product Vision

教室の「困った」を「変わった」に。

生徒が感じる教室環境の困りごとを、
学校が検討できる改善案につなげ、
対応状況と結果を生徒に返すWebアプリ。

## 2. Purpose

NIJIN教育万博2026の予選動画で、
社会課題と解決方法をわかりやすく示すための
操作可能なプロトタイプを開発する。

本番の学校向けサービスではない。

## 3. Target Users

### Student
- 教室の音や光について困りごとを投稿する。
- 学校の対応状況を確認する。
- 改善結果を確認する。

### Teacher
- 困りごとの一覧を確認する。
- 改善案の参考例を見る。
- 対応状況と理由を記録する。
- 試行結果を共有する。

Teacher mode is a demonstration, not real authorization.

## 4. Core Workflow

1. 生徒が困りごとを投稿する。
2. 投稿が一覧に反映される。
3. 先生が投稿を確認する。
4. 先生が改善案を選択または入力する。
5. 先生が対応状況を更新する。
6. 生徒が対応状況と結果を確認する。

## 5. Required Pages

1. Home
2. Student Issue Submission
3. Student Issue Status
4. Teacher Dashboard
5. Teacher Improvement Plan Editor
6. Improvement Report

## 6. Issue Categories

Initial categories:
- 音
- 光

Example issues:
- 椅子を動かす音
- 授業中の周囲の音
- 窓からのまぶしさ
- 照明のまぶしさ

## 7. Issue Statuses

- 未確認
- 検討中
- 試行予定
- 試行中
- 改善済み
- 見送り

Every decision should allow a reason or explanation.

## 8. Data Model

Issue:
- id
- category
- situation
- issueType
- status
- createdAt
- updatedAt

Improvement:
- issueId
- suggestedActions
- selectedAction
- teacherResponse
- decisionReason
- trialResult
- updatedAt

Avoid personal identifiers and sensitive data.

## 9. Demo Data

Use fictional classroom scenarios only.

Main demo:
A student reports that moving chairs creates
a distracting sound during the transition to class.

A teacher reviews the issue, chooses a possible
improvement, records a trial, and shares the result.

All sample results must be labeled as fictional.

## 10. Technical Requirements

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Lucide React
- Responsive UI
- localStorage for fictional demo state
- No backend
- No authentication
- No external data collection

## 11. Design Direction

Clean, approachable Japanese education SaaS.

Colors:
- Background: #F7F9FC
- Primary: #3478C0
- Secondary: #EAF3FC
- Success: #39A78E
- Pending: #F3B75D

Use readable typography, rounded cards,
clear navigation, and accessible status indicators.

## 12. Out of Scope

- Real school deployment
- Student accounts
- Personal information collection
- Medical or diagnostic information
- AI-generated decisions
- 3D classroom simulation
- Real-time synchronization
- Production database

## 13. Definition of Done

- Student can submit a fictional issue.
- Teacher can review the issue.
- Teacher can update the status and response.
- Student can see the updated status.
- Improvement report displays the workflow.
- Demo state persists after refresh.
- Demo can be reset.
- Mobile and desktop layouts work.
- Build and type checks pass.
- The complete flow can be recorded for a video.
