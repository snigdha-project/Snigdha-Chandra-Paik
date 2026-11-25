import ToolCalculator from "./ToolCalculator";
import ImageCompressor from "./ImageCompressor";
import EmbedTool from "./EmbedTool";
import type { ToolRuntime } from "@/lib/toolService";

// Picks the interface for a tool by the type chosen in WordPress.
// To add a new built-in type: add it to toolTypes.ts, the WordPress plugin's
// ptl_type_options(), toolService.toRuntime() and a case below.
export default function ToolRunner({
  runtime,
  title,
}: {
  runtime: ToolRuntime;
  title: string;
}) {
  switch (runtime.type) {
    case "calculator":
      return <ToolCalculator config={runtime.config} />;
    case "image-compressor":
      return <ImageCompressor config={runtime.config} />;
    case "embed":
      return <EmbedTool code={runtime.code} config={runtime.config} title={title} />;
  }
}
