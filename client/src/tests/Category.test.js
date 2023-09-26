import React from 'react';
import { render, screen} from '@testing-library/react';
import Category from './Category';
import { MemoryRouter } from 'react-router-dom';
test('category component renders', () => {
    const category = {category: 'category'}
    render(
<MemoryRouter>
    <Category category = {category} />
</MemoryRouter>
    )
})