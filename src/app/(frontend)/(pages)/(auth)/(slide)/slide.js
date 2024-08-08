export const slideReducer = (state, action) => {
  const { slideLeft, slideRight } = state;

  switch (action.type) {
    case "SLIDETOLEFT":
      return { ...state, slideLeft: true };
    case "SLIDETORIGHT":
      return { ...state, slideRight: true };
    default:
      throw new Error("Unknown action type");
  }
};
