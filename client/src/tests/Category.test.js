import React from 'react';
import { render, screen} from '@testing-library/react';
import Category from '../components/Category/Category';
import { MemoryRouter } from 'react-router-dom';
test('category component renders', () => {
    const category = {category: 'category'}
    render(
<MemoryRouter>
    <Category category = {category} />
</MemoryRouter>
    )
    const categoryText = screen.getByText('category');

    expect(categoryText).toBeInTheDocument();
   
})