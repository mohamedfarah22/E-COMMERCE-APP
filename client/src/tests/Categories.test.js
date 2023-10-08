import { screen, render, waitFor } from "@testing-library/react";
import Categories from "../features/Categories/Categories";
import { MemoryRouter } from "react-router-dom";
import { server } from "./mocks/server";
import '@testing-library/jest-dom';
import React, { useEffect } from 'react';
import userEvent from "@testing-library/user-event";
//test categories feature renders all categories recieved fro the server
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

//mock navigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use the actual module except for useNavigate
    useNavigate: jest.fn(), // Mock useNavigate
  }));

test('renders All category and other categories', async () => {
    render(
<MemoryRouter>
    <Categories filterCategory={'All'} setFilterCategory={jest.fn()}/>
</MemoryRouter>)

//find categories
await waitFor(() => {
    const allCategory = screen.getByRole('heading', {name: 'All'})
    expect(allCategory).toBeInTheDocument() 
    const ringCategory = screen.getByRole('heading', {name: 'rings'})
    expect(ringCategory).toBeInTheDocument() 
    const banglesCategory = screen.getByRole('heading', {name: 'bangles'})
    expect(banglesCategory).toBeInTheDocument() 
    const necklacesCategory = screen.getByRole('heading', {name: 'necklaces'})
    expect(necklacesCategory).toBeInTheDocument() 
    const earringsCategory = screen.getByRole('heading', {name: 'earrings'})
    expect(earringsCategory).toBeInTheDocument() 
    
})

})

test('calls setFilterCategory and navigate when All category is clicked', async () => {
    const setFilterCategory = jest.fn();
    const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
<MemoryRouter>
    <Categories setFilterCategory={setFilterCategory}/>
</MemoryRouter>)
//set up user event
const user = userEvent.setup()
//find categories
await waitFor(() => {
 //click all category
const allCategory = screen.getByRole('heading', {name: 'All'})
user.click(allCategory)

//check if filtercategory and navigate are called
expect(setFilterCategory).toHaveBeenCalledWith('All')
expect(navigateMock).toHaveBeenCalledWith('/');    
})

})
test('calls setFilterCategory and navigate when rings category is clicked', async () => {
    const setFilterCategory = jest.fn();
    const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
<MemoryRouter>
    <Categories setFilterCategory={setFilterCategory}/>
</MemoryRouter>)
//set up user event
const user = userEvent.setup()
//find categories
await waitFor(() => {
 //click all category
const allCategory = screen.getByRole('heading', {name: 'rings'})
user.click(allCategory)

//check if filtercategory and navigate are called
expect(setFilterCategory).toHaveBeenCalledWith('rings')
expect(navigateMock).toHaveBeenCalledWith('/');    
})

})
test('calls setFilterCategory and navigate when bangles category is clicked', async () => {
    const setFilterCategory = jest.fn();
    const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
<MemoryRouter>
    <Categories setFilterCategory={setFilterCategory}/>
</MemoryRouter>)
//set up user event
const user = userEvent.setup()
//find categories
await waitFor(() => {
 //click all category
const allCategory = screen.getByRole('heading', {name: 'bangles'})
user.click(allCategory)

//check if filtercategory and navigate are called
expect(setFilterCategory).toHaveBeenCalledWith('bangles')
expect(navigateMock).toHaveBeenCalledWith('/');    
})

})

test('calls setFilterCategory and navigate when necklaces category is clicked', async () => {
    const setFilterCategory = jest.fn();
    const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
<MemoryRouter>
    <Categories setFilterCategory={setFilterCategory}/>
</MemoryRouter>)
//set up user event
const user = userEvent.setup()
//find categories
await waitFor(() => {
 //click all category
const allCategory = screen.getByRole('heading', {name: 'necklaces'})
user.click(allCategory)

//check if filtercategory and navigate are called
expect(setFilterCategory).toHaveBeenCalledWith('necklaces')
expect(navigateMock).toHaveBeenCalledWith('/');    
})

})
test('calls setFilterCategory and navigate when earrings category is clicked', async () => {
    const setFilterCategory = jest.fn();
    const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
<MemoryRouter>
    <Categories setFilterCategory={setFilterCategory}/>
</MemoryRouter>)
//set up user event
const user = userEvent.setup()
//find categories
await waitFor(() => {
 //click all category
const allCategory = screen.getByRole('heading', {name: 'earrings'})
user.click(allCategory)

//check if filtercategory and navigate are called
expect(setFilterCategory).toHaveBeenCalledWith('earrings')
expect(navigateMock).toHaveBeenCalledWith('/');    
})

})
