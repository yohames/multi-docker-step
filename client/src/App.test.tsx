import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import axios from "axios";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("App", () => {
  it("renders the Home link", () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("renders the Other Page link", () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const linkElement = screen.getByText(/Other Page/i);
    expect(linkElement).toBeInTheDocument();
  });
});
