import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../utils';
import { PassportInfo } from '@/components/passport/passport-info';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test-path')
}));

// Mock usehooks-ts
vi.mock('usehooks-ts', () => ({
  useResizeObserver: vi.fn(() => ({
    width: 100,
    height: 100
  }))
}));

// Mock data
const mockPassport = {
  name: "Test Passport",
  description: "This is a test passport",
  events: [
    {
      id: "event-1",
      image_url: "/event1.jpg",
      location: {
        lat: 13.7386,
        lng: 100.5133
      }
    },
    {
      id: "event-2",
      image_url: "/event2.jpg",
      location: {
        lat: 13.7566,
        lng: 100.5025
      }
    }
  ],
  partner: {
    display_name: "Test Partner",
    profile_image: "/partner.jpg"
  }
};

// Mock the NextImage component
vi.mock('@/components/next-image', () => ({
  NextImage: ({ src, alt, fill, sizes }: { src: string, alt: string, fill?: boolean, sizes?: string }) => (
    <img data-testid="next-image" src={src} alt={alt} />
  )
}));

// Mock the Lucide icons
vi.mock('lucide-react', () => ({
  ChevronsUpDown: () => <div data-testid="chevrons-up-down">ChevronUpDown</div>,
  ChevronsDownUp: () => <div data-testid="chevrons-down-up">ChevronDownUp</div>,
  Grid: () => <div data-testid="grid-icon">Grid</div>,
  MapPin: () => <div data-testid="map-pin">MapPin</div>
}));

// Mock Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, onClick, ...props }: { 
    href: string, 
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  }) => (
    <a href={href} {...props} data-testid="next-link" onClick={onClick}>{children}</a>
  )
}));

describe('PassportInfo Component', () => {
  const mockSetSelectedEvent = vi.fn();
  const mockOnGridItemResize = vi.fn();
  const mockPathname = '/test-path';
  
  beforeEach(() => {
    mockSetSelectedEvent.mockClear();
    mockOnGridItemResize.mockClear();
    (usePathname as any).mockReturnValue(mockPathname);
  });

  it('renders correctly with passport data', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
        onGridItemResize={mockOnGridItemResize}
      />
    );
    
    // Check partner name is rendered
    expect(screen.getByText('Test Partner')).toBeInTheDocument();
    
    // Check if the passport description is rendered
    expect(screen.getByText(/Collectibles Collected/i)).toBeInTheDocument();
    
    // Check if events grid is rendered
    expect(screen.getAllByTestId('next-image')).toHaveLength(mockPassport.events.length + 1); // +1 for profile image
  });

  it('collapses/expands the content when toggle is clicked', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );
    
    // Content is initially expanded
    expect(screen.getByText(/Collectibles Collected/i)).toBeInTheDocument();
    
    // Click the toggle button - now using data-testid to find the containing button
    const toggleIcon = screen.getByTestId('chevrons-down-up');
    const toggleButton = toggleIcon.closest('button');
    fireEvent.click(toggleButton!);
    
    // Content should be collapsed
    expect(screen.queryByText(/Collectibles Collected/i)).not.toBeInTheDocument();
  });

  it('selects an event when clicking on event item', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );
    
    // Find the first event item and click it (need to find the container since it has the click handler)
    const eventImages = screen.getAllByTestId('next-image').slice(1); // Skip profile image
    const eventContainer = eventImages[0].closest('div');
    fireEvent.click(eventContainer!);
    
    // The setSelectedEvent should be called with the first event
    expect(mockSetSelectedEvent).toHaveBeenCalledWith(mockPassport.events[0]);
  });

  it('shows selected event with proper styling', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={mockPassport.events[0]}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );
    
    // Find the event items
    const eventImages = screen.getAllByTestId('next-image').slice(1); // Skip profile image
    const eventContainers = eventImages.map(img => img.closest('div'));
    
    // The first event should have the selected styling
    expect(eventContainers[0]).toHaveClass('ring-2');
    expect(eventContainers[0]).toHaveClass('ring-white');
    
    // Other events should not have selected styling
    expect(eventContainers[1]).not.toHaveClass('ring-2');
  });

  it('calls onGridItemResize with proper dimensions when resize is observed', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
        onGridItemResize={mockOnGridItemResize}
      />
    );
    
    // The useResizeObserver hook is mocked to return {width: 100, height: 100}
    // so we expect onGridItemResize to be called with these values
    expect(mockOnGridItemResize).toHaveBeenCalledWith({ width: 100, height: 100 });
  });

  it('handles navigation links correctly', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );

    // Find the tabs
    const links = screen.getAllByTestId('next-link');
    
    // Verify Grid View tab links to pathname
    const gridTab = links.find(link => link.textContent?.includes('Grid View'));
    expect(gridTab).toHaveAttribute('href', mockPathname);
    
    // Verify Map View tab exists and has a link
    const mapTab = links.find(link => link.textContent?.includes('Map View'));
    expect(mapTab).toBeInTheDocument();
    expect(mapTab).toHaveAttribute('href', `${mockPathname}?tab=map`);
  });
}); 