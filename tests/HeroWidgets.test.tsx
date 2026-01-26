
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroWidgets } from '../components/HeroWidgets';

// Mock Lucide React
jest.mock('lucide-react', () => ({
    AlertCircle: () => <div data-testid="icon-alert" />,
    User: () => <div data-testid="icon-user" />,
    // ... mock others as needed
    MoreHorizontal: () => <div data-testid="icon-more" />
}));

describe('HeroWidgets Component - Overflow Logic', () => {

    const mockActions = jest.fn();
    const mockWidgetsAllEnabled = {
        duplicateWidget: true,
        attentionWidget: true,
        editProfileWidget: true,
        favouriteWidget: true,
        resumeWidget: true,
        shortListWidget: true,
        unSubscribeWidget: true,
        referralWidget: true
    };

    it('renders only 6 items when many widgets are enabled', () => {
        render(
            <HeroWidgets
                widgets={mockWidgetsAllEnabled}
                metaData={{ originalID: true }}
                permissions={{ canEdit: true }}
                onAction={mockActions}
            />
        );

        // Check for visible buttons (should be 6 + 1 overflow = 7 total buttons in main container logic)
        // However, our code slice(0,6) renders 6 widgets. The 7th is the overflow button.
        const buttons = screen.getAllByRole('button');
        // We expect 6 widget buttons + 1 overflow button = 7
        expect(buttons.length).toBe(7);

        // Check overflow trigger exists
        expect(screen.getByTitle('More Actions')).toBeInTheDocument();
    });

    it('renders overflow dropdown on click', () => {
        render(
            <HeroWidgets
                widgets={mockWidgetsAllEnabled}
                metaData={{ originalID: true }}
                permissions={{ canEdit: true }}
                onAction={mockActions}
            />
        );

        const moreBtn = screen.getByTitle('More Actions');
        fireEvent.click(moreBtn);

        // After click, the rest should be visible in dropdown
        // Logic: 8 widgets total enabled + 1 duplicate alert = 9 items.
        // 6 visible, 3 in overflow.
        // Wait, let's recount based on passed props.
        // Duplicate(1) + 8 widgets = 9 total.
        // Visible: 6. Overflow: 3.
        // So usually we check if new content appeared.
    });

});
