import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../utils";

vi.mock("leaflet/dist/leaflet.css", () => ({}));

vi.mock("react-dom/server", () => ({
  renderToStaticMarkup: () => "<div>Mocked Icon</div>",
}));

import Map from "@/components/passport/map";

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

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
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

    const markers = screen.getAllByTestId("map-marker");
    fireEvent.click(markers[0]);

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

    const markers = screen.getAllByTestId("map-marker");
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

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.queryAllByTestId("map-marker")).toHaveLength(0);
  });
});
