import { ThreeDModels } from "@immotech-feature/property-api";
import React from "react";
import ThreeDView from "./three-d-view";

interface Props {
  parentId: string;
  object: "property" | "unit";
  onFilterIconTap?: () => void;
  type?: "outdoor" | "outdoorthermo" | "technical" | "indoor";
  models: ThreeDModels[];
  timestamp?: number;
}

export function ThreeD({
  onFilterIconTap,
  models,
  type,
  timestamp,
}: Props) {
  return models ? (
    <ThreeDView
      data={models as ThreeDModels[]}
      onFilterIconTap={onFilterIconTap}
      type={type}
      timestamp={timestamp}
    />
  ) : null;
}
