import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils";
import { PassportContent } from "@/components/passport/passport-content";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => ({
    get: vi.fn((param) => (param === "tab" ? null : null)),
  })),
  usePathname: vi.fn(() => "/test-path"),
}));

vi.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const DynamicComponent = () => (
      <div data-testid="map-component">Map Component (mocked)</div>
    );
    DynamicComponent.displayName = "MockedDynamicComponent";
    return DynamicComponent;
  },
}));

vi.mock("@/components/passport/map", () => {
  const MapComponent = () => (
    <div data-testid="map-component">Map Component (mocked)</div>
  );
  MapComponent.displayName = "MockedMapComponent";
  return { __esModule: true, default: MapComponent };
});

vi.mock("@/components/passport/passport-info", () => ({
  PassportInfo: (props: any) => {
    const handleSelectEvent = () => {
      if (props.setSelectedEvent) {
        props.setSelectedEvent(props.passport?.events[0]);
      }
    };

    return (
      <div data-testid="passport-info" onClick={handleSelectEvent}>
        Passport Info Component (mocked)
      </div>
    );
  },
}));

vi.mock("@/components/passport/event-info", () => ({
  EventInfo: (props: any) => (
    <div data-testid="event-info">Event Info Component (mocked)</div>
  ),
}));

vi.mock("@/components/passport/event-info-drawer", () => ({
  EventInfoDrawer: (props: any) => (
    <div data-testid="event-info-drawer">
      Event Info Drawer Component (mocked)
    </div>
  ),
}));

vi.mock("@/components/passport/event-selecter-drawer", () => ({
  EventSelecterDrawer: (props: any) => (
    <div data-testid="event-selecter-drawer">
      Event Selecter Drawer Component (mocked)
    </div>
  ),
}));

vi.mock("@/components/next-image", () => ({
  NextImage: (props: any) => (
    <img data-testid="next-image" src={props.src} alt={props.alt} />
  ),
}));

const mockPassport = {
  name: "Test Passport",
  description: "This is a test passport",
  events: [
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
  ],
  partner: {
    display_name: "Test Partner",
    profile_image: "/partner.jpg",
  },
};

describe("PassportContent Component", () => {
  const mockRouter = {
    replace: vi.fn(),
  };
  const mockPathname = "/test-path";

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (usePathname as any).mockReturnValue(mockPathname);
  });

  it("renders null when passport is null", () => {
    const { container } = render(<PassportContent passport={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with passport data on desktop", () => {
    (useMediaQuery as any).mockReturnValue(true); // Desktop view
    (useSearchParams as any).mockReturnValue({
      get: (param: string) => (param === "tab" ? null : null),
    });

    render(<PassportContent passport={mockPassport} />);

    expect(screen.getByTestId("passport-info")).toBeInTheDocument();
  });

  it("renders correctly with passport data on mobile with map tab", () => {
    (useMediaQuery as any).mockReturnValue(false); // Mobile view
    (useSearchParams as any).mockReturnValue({
      get: (param: string) => (param === "tab" ? "map" : null),
    });

    render(<PassportContent passport={mockPassport} />);

    expect(screen.getByTestId("passport-info")).toBeInTheDocument();
    expect(screen.getByTestId("event-selecter-drawer")).toBeInTheDocument();
  });

  it("sets default position from first event", () => {
    (useMediaQuery as any).mockReturnValue(true); // Desktop view

    render(<PassportContent passport={mockPassport} />);

    expect(screen.getByTestId("map-component")).toBeInTheDocument();
  });

  it("redirects to pathname when changing from mobile to desktop with map tab", () => {
    let isDesktopValue = false;
    (useMediaQuery as any).mockImplementation(() => isDesktopValue);
    (useSearchParams as any).mockReturnValue({
      get: (param: string) => (param === "tab" ? "map" : null),
    });

    const { rerender } = render(<PassportContent passport={mockPassport} />);

    isDesktopValue = true;
    (useMediaQuery as any).mockImplementation(() => isDesktopValue);
    rerender(<PassportContent passport={mockPassport} />);

    expect(mockRouter.replace).toHaveBeenCalledWith(mockPathname, {
      scroll: false,
    });
  });

  it("redirects to pathname when on desktop with map tab", () => {
    (useMediaQuery as any).mockReturnValue(true); // Desktop view
    (useSearchParams as any).mockReturnValue({
      get: (param: string) => (param === "tab" ? "map" : null),
    });

    render(<PassportContent passport={mockPassport} />);

    expect(mockRouter.replace).toHaveBeenCalledWith(mockPathname);
  });

  it("shows EventInfo when event is selected on desktop", () => {
    (useMediaQuery as any).mockReturnValue(true); // Desktop view

    render(<PassportContent passport={mockPassport} />);

    fireEvent.click(screen.getByTestId("passport-info"));
    expect(screen.getByTestId("event-info")).toBeInTheDocument();
  });

  it("shows EventInfoDrawer when event is selected on mobile", () => {
    (useMediaQuery as any).mockReturnValue(false); // Mobile view

    render(<PassportContent passport={mockPassport} />);

    fireEvent.click(screen.getByTestId("passport-info"));
    expect(screen.getByTestId("event-info-drawer")).toBeInTheDocument();
  });
});
