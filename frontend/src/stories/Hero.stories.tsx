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

export const Default: Story = {}