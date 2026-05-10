"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LessonRunner } from "@/components/tutorial/LessonRunner";
import { getLesson } from "@/lib/tutorial/lessons";

type Params = { lessonId: string };

export default function LessonPage({ params }: { params: Promise<Params> }) {
  const { lessonId } = use(params);
  const lesson = getLesson(lessonId);
  if (!lesson) {
    notFound();
  }
  return (
    <AppShell title={lesson.title} emoji={lesson.emoji} backHref="/tutorial">
      <LessonRunner lesson={lesson} />
    </AppShell>
  );
}
