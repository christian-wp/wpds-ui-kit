import * as React from "react";
import { PaginationDots as Component } from "./";
import { theme, styled, darkTheme } from "@washingtonpost/wpds-theme";
import { Button } from "@washingtonpost/wpds-button";
import { InputText } from "@washingtonpost/wpds-ui-kit";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const Stack = styled("section", {
  display: "flex",
  flexDirection: "column",
  gap: "$100",
  marginBlockStart: "$200",
  borderRadius: "$075",
});

const HStack = styled("section", {
  display: "flex",
  flexDirection: "row",
  gap: "$100",
  borderRadius: "$075",
});

export default {
  title: "PaginationDots",
  component: Component,
};

const DefaultArgs = {
  amount: 6,
  index: 1,
  label: "Pagination Dots",
};

const Label = styled("h3", {
  color: theme.colors.primary,
  margin: 0,
  textAlign: "center",
});

export const PaginationDots = (args) => (
  <Stack css={{ position: "relative" }}>
    <Label>Pagination Dots</Label>
    <Component {...args} />
  </Stack>
);

PaginationDots.args = { ...DefaultArgs };

const Template = (args, context) => {
  const id = React.useMemo(() => `${Math.random()}-amount`.slice(2), []);
  const [amount, setAmount] = React.useState(5);
  const [index, setIndex] = React.useState(1);

  React.useEffect(() => setAmount(amount), [amount]);

  return (
    <Stack css={{ position: "relative" }}>
      <Label>Pagination Dots with Controller</Label>
      <InputText
        data-testid={`${context.theme}-input-text`}
        id={id}
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        label="Total dots"
      />
      <HStack css={{ alignItems: "center" }}>
        <Button
          data-testid={`${context.theme}-dec-btn`}
          onClick={() => setIndex(index - 1 > 0 ? index - 1 : 1)}
        >
          -
        </Button>
        <Label
          css={{
            fontSize: theme.fontSizes[100],
            fontWeight: theme.fontWeights["regular"],
          }}
        >
          increase/decrease index
        </Label>
        <Button
          data-testid={`${context.theme}-inc-btn`}
          css={{ float: "right" }}
          onClick={() => setIndex(index + 1 < amount ? index + 1 : amount)}
        >
          +
        </Button>
      </HStack>
      <Component
        index={index ? index : 1}
        amount={amount ? amount : 5}
        label={`${context.theme}-pagination`}
      />
    </Stack>
  );
};

export const WithControls = Template.bind({});
// Function to emulate pausing between interactions
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const Interactions = Template.bind({});
Interactions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const paginationDots = canvas.getByLabelText("light-pagination");

  // change amount of dots
  userEvent.type(canvas.getByTestId("light-input-text"), "{backspace}6");
  await sleep(500);
  // check incrementing index changes ariaValueNow
  userEvent.click(canvas.getByTestId("light-inc-btn"));
  let ariaValueNow = paginationDots.getAttribute("aria-valuenow");
  expect(ariaValueNow).toBe("2");
  await sleep(500);

  // traverse all dots
  for (let i = 0; i < 9; i++) {
    var btn = i < 4 ? "light-inc-btn" : "light-dec-btn";
    userEvent.click(canvas.getByTestId(btn));
    await sleep(500);
  }

  // test ariaValueMax change on amount change
  userEvent.type(canvas.getByTestId("light-input-text"), "{backspace}12");
  await sleep(500);
  let ariaValueMax = paginationDots.getAttribute("aria-valuemax");
  expect(ariaValueMax).toBe("12");

  // test dots never go below 0
  userEvent.type(
    canvas.getByTestId("light-input-text"),
    "{backspace}{backspace}0"
  );
  await sleep(500);
  ariaValueMax = paginationDots.getAttribute("aria-valuemax");
  ariaValueNow = paginationDots.getAttribute("aria-valuenow");
  expect(ariaValueMax).toBe("1");
  expect(ariaValueNow).toBe("1");

  // tests a large number of dots doesn't modify other elements
  userEvent.type(canvas.getByTestId("light-input-text"), "{backspace}50");
  await sleep(500);
};

export const Chromatic = () => (
  <Stack>
    <Stack css={{ position: "relative" }}>
      <Label>First item active, 5 or less items</Label>
      <Component amount={5} index={1} label="Sample label" />
    </Stack>
    <Stack css={{ position: "relative" }}>
      <Label>First item active, more than 5 items</Label>
      <Component amount={6} index={1} label="Sample label" />
    </Stack>
    <Stack css={{ position: "relative" }}>
      <Label>Middle item active, 5 or less items</Label>
      <Component amount={5} index={3} label="Sample label" />
    </Stack>
    <Stack css={{ position: "relative" }}>
      <Label>Middle item active, more than 5 items</Label>
      <Component amount={7} index={4} label="Sample label" />
    </Stack>
    <Stack css={{ position: "relative" }}>
      <Label>Last item active, 5 or less items</Label>
      <Component amount={5} index={5} label="Sample label" />
    </Stack>
    <Stack css={{ position: "relative" }}>
      <Label>Last item active, more than 5 items</Label>
      <Component amount={6} index={6} label="Sample label" />
    </Stack>
  </Stack>
);
