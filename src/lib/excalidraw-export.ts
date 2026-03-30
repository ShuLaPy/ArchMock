import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

export async function captureExcalidrawSvg(
  api: ExcalidrawImperativeAPI
): Promise<string> {
  const { exportToSvg } = await import("@excalidraw/excalidraw");
  const elements = api.getSceneElements();
  const appState = api.getAppState();

  if (elements.length === 0) return "";

  const svgElement = await exportToSvg({
    elements,
    appState: {
      ...appState,
      exportWithDarkMode: false,
      exportBackground: true,
    },
    files: api.getFiles(),
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}
