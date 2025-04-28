import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../utils";
import { EventInfoDrawer } from "@/components/passport/event-info-drawer";
import { PassportEvent } from "@/components/passport/passport-content";

// Mock the NextImage component
vi.mock("@/components/next-image", () => ({
  NextImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="next-image" src={src} alt={alt} />
  ),
}));

// Mock the Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
  }) => (
    <button
      data-testid={ariaLabel === "Close" ? "close-button" : "action-button"}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

// Mock the Drawer component
vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="drawer">{children}</div> : null,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-title">{children}</div>
  ),
}));

// Mock the X icon from Lucide
vi.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X Icon</div>,
}));

describe("EventInfoDrawer Component", () => {
  const mockEvent: PassportEvent = {
    id: "event-1",
    image_url: "/test-image.jpg",
    location: {
      lat: 13.7566,
      lng: 100.5025,
    },
  };

  const mockOnClose = vi.fn();

  it("renders nothing when open is false", () => {
    const { container } = render(
      <EventInfoDrawer
        open={false}
        selectedEvent={mockEvent}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  it("renders the drawer when open is true", () => {
    render(
      <EventInfoDrawer
        open={true}
        selectedEvent={mockEvent}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.getByText(/ทางม้าลายแยกเฉลิมบุรี/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <EventInfoDrawer
        open={true}
        selectedEvent={mockEvent}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders with gridItemDimensions when provided", () => {
    const gridItemDimensions = { width: 100, height: 100 };

    render(
      <EventInfoDrawer
        open={true}
        selectedEvent={mockEvent}
        onClose={mockOnClose}
        gridItemDimensions={gridItemDimensions}
      />
    );

    // Check if there's an element with the specified dimensions
    const imageContainer = screen.getByTestId("next-image").parentElement;
    expect(imageContainer).toHaveStyle({ width: "100px", height: "100px" });
  });
});
