import "../index.css"
import type { Meta, StoryObj } from '@storybook/react';
import Hero from "../components/Hero"

const meta = {
    title: "Hero",
    component: Hero,
    parameters: {
        layout: 'fullscreen'
    }
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof Hero>

export const Default: Story = {
    decorators: [
        (Story) => (
            <div>
                {/* Breakpoint indicator */}
                <div className="fixed top-0 left-0 z-50 bg-red-500 text-white p-2 text-xs">
                    <span className="block sm:hidden">XS (default)</span>
                    <span className="hidden sm:block md:hidden">SM (≥640px)</span>
                    <span className="hidden md:block lg:hidden">MD (≥768px)</span>
                    <span className="hidden lg:block xl:hidden">LG (≥1024px)</span>
                    <span className="hidden xl:block">XL (≥1280px)</span>
                </div>
                <Story />
            </div>
        ),
    ],
}

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile2',
        },
    },
}

export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
}