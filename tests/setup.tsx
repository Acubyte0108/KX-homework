import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

afterEach(() => {
  cleanup();
});

vi.mock("leaflet/dist/leaflet.css", () => ({}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (factory: () => any) => {
    // Return the factory directly so we can test whatever it exports
    return factory();
  },
}));

vi.mock("leaflet", () => {
  const mockPrototype = {
    _getIconUrl: vi.fn(),
  };

  return {
    __esModule: true,
    default: {
      Icon: {
        Default: {
          prototype: mockPrototype,
          mergeOptions: vi.fn(),
        },
      },
      divIcon: vi.fn(() => ({})),
      DomEvent: {
        disableClickPropagation: vi.fn(),
        disableScrollPropagation: vi.fn(),
      },
      LatLngTuple: Array,
      LatLngExpression: Array,
      Map: class MockMap {
        flyTo = vi.fn();
      },
    },
  };
});

vi.mock("react-leaflet", () => {
  // Create mock functions using React.createElement instead of JSX
  const createMapContainer = (props: any) => {
    return React.createElement("div", {
      "data-testid": "map-container",
      className: props.className,
      children: props.children,
    });
  };

  const createTileLayer = () => {
    return React.createElement("div", { "data-testid": "tile-layer" });
  };

  const createMarker = (props: any) => {
    return React.createElement("div", {
      "data-testid": "map-marker",
      "data-position": JSON.stringify(props.position),
      onClick: () => props.eventHandlers?.click?.(),
      children: props.children,
    });
  };

  const createPopup = (props: any) => {
    return React.createElement("div", {
      "data-testid": "map-popup",
      children: props.children,
    });
  };

  const createCircle = () => {
    return React.createElement("div", { "data-testid": "map-circle" });
  };

  return {
    __esModule: true,
    MapContainer: vi.fn(createMapContainer),
    TileLayer: vi.fn(createTileLayer),
    Marker: vi.fn(createMarker),
    Popup: vi.fn(createPopup),
    Circle: vi.fn(createCircle),
    useMap: () => ({
      flyTo: vi.fn(),
    }),
  };
});

vi.mock("react-dom/server", () => ({
  renderToStaticMarkup: vi.fn(() => "<div>Mock Icon</div>"),
}));
