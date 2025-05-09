import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../utils";

// Mock the leaflet CSS import
vi.mock("leaflet/dist/leaflet.css", () => ({}));

// Import the component after setting up mocks
import MiniMap from "@/components/passport/mini-map";

describe("MiniMap Component", () => {
  const defaultPosition: [number, number] = [13.7386, 100.5133];
  const selectedPosition: [number, number] = [13.7566, 100.5025];

  it("renders correctly with default position", () => {
    render(<MiniMap defaultPosition={defaultPosition} />);

    // Check if map container is rendered
    expect(screen.getByTestId("map-container")).toBeInTheDocument();

    // Check if tile layer is rendered
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();

    // No marker should be rendered without a selectedPosition
    expect(screen.queryByTestId("map-marker")).not.toBeInTheDocument();
  });

  it("renders correctly with selected position", () => {
    render(
      <MiniMap
        defaultPosition={defaultPosition}
        selectedPosition={selectedPosition}
      />
    );

    // Check if map container is rendered
    expect(screen.getByTestId("map-container")).toBeInTheDocument();

    // Check if tile layer is rendered
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();

    // A marker should be rendered with a selectedPosition
    expect(screen.getByTestId("map-marker")).toBeInTheDocument();
  });

  it("applies custom zoom levels", () => {
    const initialZoom = 10;
    const maxZoom = 16;

    render(
      <MiniMap
        defaultPosition={defaultPosition}
        initialZoomLevel={initialZoom}
        maxZoomLevel={maxZoom}
      />
    );

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "test-custom-class";

    render(
      <MiniMap defaultPosition={defaultPosition} className={customClass} />
    );

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toHaveAttribute(
      "class",
      expect.stringContaining(customClass)
    );
  });
});
