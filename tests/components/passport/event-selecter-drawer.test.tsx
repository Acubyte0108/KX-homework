import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../utils";
import { EventSelecterDrawer } from "@/components/passport/event-selecter-drawer";
import { PassportData } from "@/components/passport/passport-content";

vi.mock("@/components/next-image", () => ({
  NextImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="next-image" src={src} alt={alt} />
  ),
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="drawer">{children}</div> : null,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-header">{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-title">{children}</div>
  ),
}));

describe("EventSelecterDrawer Component", () => {
  const mockPassport: PassportData = {
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

  const mockSetSelectedEvent = vi.fn();

  it("renders nothing when open is false", () => {
    render(
      <EventSelecterDrawer
        open={false}
        passport={mockPassport}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );

    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  it("renders the drawer when open is true", () => {
    render(
      <EventSelecterDrawer
        open={true}
        passport={mockPassport}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-header")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-title")).toBeInTheDocument();

    expect(
      screen.getByText(/Tab the slot or location pin to information/i)
    ).toBeInTheDocument();

    const eventImages = screen.getAllByTestId("next-image");
    expect(eventImages).toHaveLength(mockPassport.events.length);
  });

  it("calls setSelectedEvent when an event is clicked", () => {
    render(
      <EventSelecterDrawer
        open={true}
        passport={mockPassport}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );

    const eventImages = screen.getAllByTestId("next-image");
    fireEvent.click(eventImages[0]);
    expect(mockSetSelectedEvent).toHaveBeenCalledWith(mockPassport.events[0]);
  });

  it("handles null passport gracefully", () => {
    render(
      <EventSelecterDrawer
        open={true}
        passport={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
  });
});
