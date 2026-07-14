"use client";

import { Component } from "react";

/** Deterministic browser-only fixture for proving preview error isolation. */
export class PreviewErrorFixture extends Component {
  override componentDidMount() {
    throw new Error("Intentional preview isolation fixture");
  }

  override render() {
    return null;
  }
}
