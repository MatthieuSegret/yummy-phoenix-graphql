export type FlashMessageVariables = {
  notice?: string | null;
  error?: string | null;
};

export type FlashMessage = {
  type: string;
  text: string;
};

export type FlashMessageQuery = {
  message: FlashMessage;
};

export type MutationState = {
  loading: boolean;
  error: any;
  success: boolean;
};

export type MutationStateProps = {
  wrapMutate: (promise: Promise<any>) => Promise<any>;
};

export type RevokeTokenMutation = {
  revokeToken: {
    errors: any;
  };
};

export type SignInMutationVariables = {
  email: string;
  password: string;
};

export type SignInMutation = {
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

export type CreateCommentMutationVariables = {
  recipeId: string;
  body: string;
};

export type CreateCommentMutation = {
  createComment: {
    __typename: 'CommentPayload';
    newComment: CommentFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CreateRecipeMutationVariables = {
  title: string;
  content: string;
  totalTime: string;
  level: string;
  budget: string;
  image?: string;
};

export type CreateRecipeMutation = {
  createRecipe: {
    __typename: 'RecipePayload';
    newRecipe: RecipeForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type DeleteRecipeMutationVariables = {
  id: string;
};

export type DeleteRecipeMutation = {
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

export type RecipeForEditingQueryVariables = {
  id: string;
};

export type RecipeForEditingQuery = {
  recipe: RecipeForEditingFragment | null;
};

export type RecipeOptionsQuery = {
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

export type RecipeQueryVariables = {
  id: string;
};

export type RecipeQuery = {
  recipe: RecipeFragment | null;
};

export type RecipeWithDefaultValueQuery = {
  recipeWithDefaultValue: {
    __typename: 'Recipe';
    totalTime: string;
    level: string;
    budget: string;
  } | null;
};

export type RecipesQueryVariables = {
  offset?: number | null;
  keywords?: string | null;
};

export type RecipesQuery = {
  recipesCount: number;
  recipes: Array<RecipePreviewFragment> | null;
};

export type UpdateRecipeMutationVariables = {
  id: string;
  title?: string | null;
  content?: string | null;
  totalTime?: string | null;
  level?: string | null;
  budget?: string | null;
  removeImage?: boolean | null;
  image?: string | null;
};

export type UpdateRecipeMutation = {
  updateRecipe: {
    __typename: 'RecipePayload';
    recipe: RecipeForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CancelAccountMutation = {
  cancelAccount: {
    errors: any;
  };
};

export type ChangePasswordMutationVariables = {
  password: string;
  passwordConfirmation: string;
  currentPassword: string;
};

export type ChangePasswordMutation = {
  changePassword: {
    __typename: 'UserPayload';
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type CurrentUserQuery = {
  currentUser: User | null;
};

export type SignUpMutationVariables = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type SignUpMutation = {
  signUp: {
    __typename: 'UserPayload';
    user: UserForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type UpdateUserMutationVariables = {
  name?: string | null;
  email?: string | null;
};

export type UpdateUserMutation = {
  updateUser: {
    __typename: 'UserPayload';
    user: UserForEditingFragment | null;
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type ConfirmAccountMutationVariables = {
  email: string;
  code: string;
};

export type ConfirmAccountMutation = {
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

export type ResendConfirmationMutationVariables = {
  email: string;
};

export type ResendConfirmationMutation = {
  resendConfirmation: {
    __typename: 'BooleanPayload';
    errors: any;
    messages: Array<ValidationMessage> | null;
  };
};

export type GetUserForEditingQuery = {
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
