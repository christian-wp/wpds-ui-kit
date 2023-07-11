import * as React from "react";
import { render, screen } from "@testing-library/react";
import { InputSearchOtherState } from "./InputSearchOtherState";
import { Icon } from "@washingtonpost/wpds-icon";
import { Settings } from "@washingtonpost/wpds-assets";

describe("InputSearchOtherState", () => {
  test("renders visibly into the document", () => {
    render(
      <InputSearchOtherState
        icon={
          <Icon label="test">
            <Settings />
          </Icon>
        }
      />
    );
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
