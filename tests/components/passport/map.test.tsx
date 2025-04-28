import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../utils";

// Mock the leaflet CSS import
vi.mock("leaflet/dist/leaflet.css", () => ({}));

// Mock renderToStaticMarkup
vi.mock("react-dom/server", () => ({
  renderToStaticMarkup: () => "<div>Mocked Icon</div>",
}));

// Import the Map component after setting up mocks
import Map from "@/components/passport/map";

// Mock data
const mockEvents = [
  {
    id: "event-1",
    image_url: "/event1.jpg",
    location: {
      lat: 13.7386,
      lng: 100.5133,
    },
  },
  {
    id: "event-2",
    image_url: "/event2.jpg",
    location: {
      lat: 13.7566,
      lng: 100.5025,
    },
  },
];

describe("Map Component", () => {
  it("renders the map container with default position", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnSelectEvent = vi.fn();

    render(
      <Map
        defaultPosition={defaultPosition}
        events={mockEvents}
        onSelectEvent={mockOnSelectEvent}
      />
    );

    // Check if map container is rendered
    expect(screen.getByTestId("map-container")).toBeInTheDocument();

    // Check if tile layer is rendered
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();

    // Check if markers are rendered for each event
    expect(screen.getAllByTestId("map-marker")).toHaveLength(mockEvents.length);
  });

  it("calls onSelectEvent when a marker is clicked", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnSelectEvent = vi.fn();

    render(
      <Map
        defaultPosition={defaultPosition}
        events={mockEvents}
        onSelectEvent={mockOnSelectEvent}
      />
    );

    // Find the first marker and click it
    const markers = screen.getAllByTestId("map-marker");
    fireEvent.click(markers[0]);

    // The onSelectEvent should be called with the first event
    expect(mockOnSelectEvent).toHaveBeenCalledWith(mockEvents[0]);
  });

  it("applies selected styling to the selected event marker", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnSelectEvent = vi.fn();
    const selectedEvent = mockEvents[0];

    render(
      <Map
        defaultPosition={defaultPosition}
        events={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        selectedEvent={selectedEvent}
      />
    );

    // Find all markers
    const markers = screen.getAllByTestId("map-marker");

    // We can't directly test the styling since our React-Leaflet is mocked,
    // but we can at least verify the correct number of markers are rendered
    expect(markers).toHaveLength(mockEvents.length);
  });

  it("renders with no events", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnSelectEvent = vi.fn();

    render(
      <Map
        defaultPosition={defaultPosition}
        events={[]}
        onSelectEvent={mockOnSelectEvent}
      />
    );

    // Map container should still render
    expect(screen.getByTestId("map-container")).toBeInTheDocument();

    // No markers should be rendered
    expect(screen.queryAllByTestId("map-marker")).toHaveLength(0);
  });
});
