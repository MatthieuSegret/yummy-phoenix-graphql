export type FlashMessageVariables = {
  notice?: string | null;
  error?: string | null;
};

export type FlashMessage = {
  type: string;
  text: string;
};

export type FlashMessageData = {
  message: FlashMessage;
};

export type RevokeTokenData = {
  revokeToken: {
    errors: any;
  };
};

export type SignInVariables = {
  email: string;
  password: string;
};

export type SignInData = {
  signIn: {
    __typename: 'SessionPayload';
    result: {
      __typename: 'Session';
      token: string;
    } | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CreateCommentVariables = {
  recipeId: string;
  body: string;
};

export type CreateCommentData = {
  createComment: {
    __typename: 'CommentPayload';
    newComment: CommentFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CreateRecipeVariables = {
  title: string;
  content: string;
  totalTime: string;
  level: string;
  budget: string;
  image?: string;
};

export type CreateRecipeData = {
  createRecipe: {
    __typename: 'RecipePayload';
    newRecipe: RecipeForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type DeleteRecipeVariables = {
  id: string;
};

export type DeleteRecipeData = {
  deleteRecipe: {
    __typename: 'RecipePayload';
    recipe: {
      __typename: 'Recipe';
      id: string;
    };
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type RecipeForEditingVariables = {
  id: string;
};

export type RecipeForEditingData = {
  recipe: RecipeForEditingFragment | null;
};

export type RecipeOptionsData = {
  totalTimeOptions: Array<{
    __typename: 'Option';
    label: string;
    value: string;
  }> | null;
  levelOptions: Array<{
    __typename: 'Option';
    label: string;
    value: string;
  }> | null;
  budgetOptions: Array<{
    __typename: 'Option';
    label: string;
    value: string;
  }> | null;
};

export type RecipeVariables = {
  id: string;
};

export type RecipeData = {
  recipe: RecipeFragment | null;
};

export type RecipeWithDefaultValueData = {
  recipeWithDefaultValue: {
    __typename: 'Recipe';
    totalTime: string;
    level: string;
    budget: string;
  } | null;
};

export type RecipesVariables = {
  offset?: number | null;
  keywords?: string | null;
};

export type RecipesData = {
  recipesCount: number;
  recipes: Array<RecipePreviewFragment> | null;
};

export type UpdateRecipeVariables = {
  id: string;
  title?: string | null;
  content?: string | null;
  totalTime?: string | null;
  level?: string | null;
  budget?: string | null;
  removeImage?: boolean | null;
  image?: string | null;
};

export type UpdateRecipeData = {
  updateRecipe: {
    __typename: 'RecipePayload';
    recipe: RecipeForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CancelAccountData = {
  cancelAccount: {
    errors: any;
  };
};

export type ChangePasswordVariables = {
  password: string;
  passwordConfirmation: string;
  currentPassword: string;
};

export type ChangePasswordData = {
  changePassword: {
    __typename: 'UserPayload';
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CurrentUserData = {
  currentUser: User | null;
};

export type SignUpVariables = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type SignUpData = {
  signUp: {
    __typename: 'UserPayload';
    user: UserForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type UpdateUserVariables = {
  name?: string | null;
  email?: string | null;
};

export type UpdateUserData = {
  updateUser: {
    __typename: 'UserPayload';
    user: UserForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type ConfirmAccountVariables = {
  email: string;
  code: string;
};

export type ConfirmAccountData = {
  confirmAccount: {
    __typename: 'SessionPayload';
    result: {
      __typename: 'Session';
      token: string;
    } | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type ResendConfirmationVariables = {
  email: string;
};

export type ResendConfirmationData = {
  resendConfirmation: {
    __typename: 'BooleanPayload';
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type GetUserForEditingData = {
  // Fetch the current user
  currentUser: UserForEditingFragment | null;
};

export type CommentFragment = {
  __typename: 'Comment';
  id: string;
  body: string;
  inserted_at: string;
  author: {
    __typename: string;
    id: string;
    name: string;
  };
};

export type RecipeForEditingFragment = {
  __typename: 'Recipe';
  id: string;
  title: string;
  content: string;
  description: string;
  totalTime: string;
  level: string;
  budget: string;
  image_url: string | null;
};

export type RecipeFragment = {
  __typename: 'Recipe';
  id: string;
  title: string;
  content: string;
  description: string;
  totalTime: string;
  level: string;
  budget: string;
  image_url: string;
  inserted_at: string;
  author: {
    __typename: string;
    id: string;
    name: string;
  };
  comments: Array<CommentFragment>;
};

export type RecipePreviewFragment = {
  __typename: 'Recipe';
  id: string;
  title: string;
  description: string;
  totalTime: string;
  level: string;
  budget: string;
  image_url?: string | null;
  author: {
    __typename: string;
    id: string;
    name: string;
  };
};

export type UserForEditingFragment = {
  __typename: 'User';
  id: string;
  name: string;
  email: string;
};

export type ValidationMessage = {
  __typename: 'ValidationMessage';
  field: string;
  message: string;
};

export type User = {
  __typename: 'User';
  id: string;
  name: string;
  email: string;
};
