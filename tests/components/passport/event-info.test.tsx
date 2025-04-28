import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../utils";
import { EventInfo } from "@/components/passport/event-info";
import React from "react";

// Mock the dynamic import for MiniMap
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MiniMapMock = () => (
      <div data-testid="mini-map">Mini Map Component (Mocked)</div>
    );
    return MiniMapMock;
  },
}));

// Mock the NextImage component
vi.mock("@/components/next-image", () => ({
  NextImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="next-image" src={src} alt={alt} />
  ),
}));

// Mock the Accordion component
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({
    children,
    type,
    collapsible,
    defaultValue,
    className,
  }: any) => (
    <div data-testid="accordion" className={className}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value }: any) => (
    <div data-testid="accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, className }: any) => (
    <div data-testid="accordion-trigger" className={className}>
      {children}
    </div>
  ),
  AccordionContent: ({ children, className }: any) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  ),
}));

// Mock the Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

// Mock data
const mockEvent = {
  id: "event-1",
  image_url: "/event1.jpg",
  location: {
    lat: 13.7386,
    lng: 100.5133,
    address: "Landmark Address, Bangkok",
  },
};

const mockPartner = {
  display_name: "Test Partner",
  profile_image: "/profile.jpg",
};

describe("EventInfo Component", () => {
  it("renders event information correctly", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnClose = vi.fn();

    render(
      <EventInfo
        selectedEvent={mockEvent}
        partner={mockPartner}
        defaultPosition={defaultPosition}
        onClose={mockOnClose}
      />
    );

    // Check if event ID is displayed in the title
    expect(screen.getByText(/event-1/)).toBeInTheDocument();

    // Check if partner name is displayed
    expect(screen.getByText(mockPartner.display_name)).toBeInTheDocument();

    // Check if image is displayed
    const eventImage = screen.getAllByTestId("next-image")[0];
    expect(eventImage).toBeInTheDocument();
    expect(eventImage).toHaveAttribute("src", mockEvent.image_url);
  });

  it("calls onClose when close button is clicked", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnClose = vi.fn();

    render(
      <EventInfo
        selectedEvent={mockEvent}
        partner={mockPartner}
        defaultPosition={defaultPosition}
        onClose={mockOnClose}
      />
    );

    // Find close button and click it
    const buttons = screen.getAllByTestId("button");
    const closeButton = buttons.find((btn) =>
      btn.className?.includes("absolute")
    );

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Close button not found");
    }
  });

  it('displays the "Collect Now" button', () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnClose = vi.fn();

    render(
      <EventInfo
        selectedEvent={mockEvent}
        partner={mockPartner}
        defaultPosition={defaultPosition}
        onClose={mockOnClose}
      />
    );

    // Check if the Collect Now button is rendered
    expect(screen.getByText("Collect Now")).toBeInTheDocument();
  });

  it("has accordion sections for information", () => {
    const defaultPosition: [number, number] = [13.75, 100.5167]; // Bangkok
    const mockOnClose = vi.fn();

    render(
      <EventInfo
        selectedEvent={mockEvent}
        partner={mockPartner}
        defaultPosition={defaultPosition}
        onClose={mockOnClose}
      />
    );

    // Check if accordion sections are rendered
    expect(
      screen.getByText("How to collect this collectible")
    ).toBeInTheDocument();
    expect(screen.getByText("Collectible Preview")).toBeInTheDocument();
  });
});
