import { useEffect, useState } from "react";
import {
  completeLesson,
  initialProgress,
  sanitizeProgress,
  type DictionaryEntry,
  type Lesson,
  type Progress,
  type SkillId,
} from "./game";

const STORAGE_KEY = "code-quest-progress-v1";

function readProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeProgress(JSON.parse(stored)) : initialProgress;
  } catch {
    return initialProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const finishDiagnosis = (skills: Record<SkillId, number>) => {
    setProgress((current) => ({ ...current, diagnosed: true, skills }));
  };

  const finishLesson = (lesson: Lesson) => {
    setProgress((current) => completeLesson(current, lesson));
  };

  const addTerm = (entry: DictionaryEntry) => {
    setProgress((current) => {
      const exists = current.dictionary.some(
        (item) => item.term.toLowerCase() === entry.term.toLowerCase(),
      );
      return exists
        ? current
        : { ...current, dictionary: [entry, ...current.dictionary] };
    });
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(initialProgress);
  };

  return { progress, finishDiagnosis, finishLesson, addTerm, reset };
}
