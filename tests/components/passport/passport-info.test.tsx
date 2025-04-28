import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../utils';
import { PassportInfo } from '@/components/passport/passport-info';

// Mock data
const mockPassport = {
  id: "passport-1",
  name: "ฝาท่อ Chinatown เยาวราช",
  title: "Sample Passport",
  description: "This is a sample passport description",
  partner: {
    id: "partner-1",
    display_name: "Test Partner",
    profile_image: "/test-profile.jpg"
  },
  events: [
    {
      id: "event-1",
      title: "Event 1",
      description: "Event 1 Description",
      image_url: "/event1.jpg",
      location: {
        lat: 13.7386,
        lng: 100.5133,
        address: "Event 1 Address"
      }
    },
    {
      id: "event-2",
      title: "Event 2",
      description: "Event 2 Description",
      image_url: "/event2.jpg",
      location: {
        lat: 13.7566,
        lng: 100.5025,
        address: "Event 2 Address"
      }
    }
  ]
};

// Mock the NextImage component
vi.mock('@/components/next-image', () => ({
  NextImage: ({ src, alt, fill, sizes }: { src: string, alt: string, fill?: boolean, sizes?: string }) => (
    <img data-testid="next-image" src={src} alt={alt} />
  )
}));

describe('PassportInfo Component', () => {
  const mockSetSelectedEvent = vi.fn();
  
  beforeEach(() => {
    mockSetSelectedEvent.mockClear();
  });

  it('renders correctly with passport data', () => {
    render(
      <PassportInfo 
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );
    
    // Check partner name is rendered
    expect(screen.getByText('Coral')).toBeInTheDocument();
    
    // Check if the passport description is rendered
    expect(screen.getByText(/Collectibles Collected/i)).toBeInTheDocument();
    
    // Check if events grid is rendered
    expect(screen.getAllByTestId('next-image')).toHaveLength(mockPassport.events.length + 1); // +1 for profile image
  });

  it('shows map view tab with correct styling when tab is "map"', () => {
    render(
      <PassportInfo 
        tab="map"
        passport={mockPassport}
        selectedEvent={null}
        setSelectedEvent={mockSetSelectedEvent}
      />
    );
    
    // The map tab should be active
    const mapTab = screen.getByText(/Map View/i).closest('a');
    expect(mapTab).toHaveClass('border-b-white');
    
    // Grid tab should not be active
    const gridTab = screen.getByText(/Grid View/i).closest('a');
    expect(gridTab).not.toHaveClass('border-b-white');
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
    
    // Click the toggle button
    const toggleButton = screen.getByRole('button', { name: '' }); // No accessible name for the button
    fireEvent.click(toggleButton);
    
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
    
    // Find the first event item and click it
    const eventItems = screen.getAllByTestId('next-image').slice(1); // Skip profile image
    fireEvent.click(eventItems[0]);
    
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
    const eventContainers = screen.getAllByTestId('next-image')
      .slice(1) // Skip profile image
      .map(img => img.closest('div'));
    
    // The first event should have the selected styling
    expect(eventContainers[0]).toHaveClass('ring-2');
    expect(eventContainers[0]).toHaveClass('ring-white');
    
    // Other events should not have selected styling
    expect(eventContainers[1]).not.toHaveClass('ring-2');
  });
}); 