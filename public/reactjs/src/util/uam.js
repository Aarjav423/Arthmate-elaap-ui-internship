import { storedList } from "../util/localstorage";
const user = storedList("user");

// function to validate component level access metrix tags
export const checkAccessTags = tagsToRenderComponent => {
  let tagExistArray = [];
  tagsToRenderComponent.forEach(item => {
    if (user?.access_metrix_tags?.includes(item)) {
      tagExistArray.push(item);
    }
  });
  return tagExistArray.length > 0;
};
