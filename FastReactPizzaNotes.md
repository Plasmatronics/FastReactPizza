## LETS PLAN

Remember:
a). break the desired UI into components
b). Build a stateless, static version
c). Think about state managemetn+data flow then implement it

BUT for a real-world application we need to adapt this mindset a little bit
Adapted Version:
a). Gather application requirement and feature
b). DIvide the application into pages
...think abou the overall and page-level UI
...break the desired UI into components
...Design and build a static version without state
c). Divide the application into feature categoreis
....think about state management +data flow in this feature categories context
d). decide on what libraries to use (tech decisions)

What are out Featur Categories(we can now also map features to different subpages....)?
1). User
2). Menu
3). Cart
4). Order
ALL FEATURES we create in the app can be placed into one of these 4 parent feature categories

Lets Plan Our Pages...
1). User--->Homepage(/)
2). Menu--->Pizza Menu(/meu)
3). Cart--->Cart(/cart)
4). Order--->Placing a new Order(/order/new) AND looking up an order(/order/:orderid)

Lets Plan our Slices...
1). User--->gloabl UI state
2). Menu--->global remote state(fetche from an API)
3). Cart--->global UI state
4). Order--->global remote state (fetched and submitted to an API)

Lets Plan Tech Decisoins....
Our Tech Stack will be
Routing---> React Router
Styling---> tailwindCSS (just as an opportunity to learn it)
Remote State Management--> React Router (we'll learn React Query soon)
-There is a new way of fetching data right inside React Router (render as you fetch)
-It used to be "fetch on render".... not really state management as it doesnt persist state....
UI State Managment--->Redux

## LETS FILE STRUCUTRE

well implement a feature based strucutre...
well make a features folder and then create a subfolder for each actual feature
each actual feature that has its own folder will container all the custom hooks,
all the components, and all the js files necessary to make it work.

Letse have a reusable folder (call it UI)
for buttons, inputs, etc....
this will be purely UI and have no side effects.

Lets have a services folder
for reusable code for interacting with an API

Lets have a utility folder...
(call it utils)
for helper functions that are stateless and do not have side effects

## REACT ROUTER IN THIS WAY LOOKS A LITTLE DIFFERET...

const router = createBrowserRouter([
{
path: "/",
element: <Home />,
},
{
path: "/menu",
element: <Menu />,
},
]);

function App() {
return <RouterProvider router={router} />;
}

Before...
we were much more declarative... we had BrwoeserRouter wrapping Routes wrapping each Route

This Way...
This way is more impertaive... we are declaring router outside jsx
and using this js array inside createBrowserRouter then just placing that whole darn things as a component niside our return block.
this method is what will allow us to enable data fetching... we can load and submit data
data only with createBrowserRouter

We also do not need a fallback Route (\*) because we will have a different way of handling such errors.

_But What Do Nested Routes Now Look Like?..._
{
element: <AppLayout />,
children: [
{
path: "/",
element: <Home />,
},......
]
}
So on a parent route we have the children property and then add a nested array with objects of routes.
Notice no path on the AppLayout... this means that this is a layout route... the only purpose is to provide a layout to the application.
To direct the children's content we still use <Outlet/>

## ONE OF REACT ROUTES NEW POWERFUL FEATURES: LOADERS

Loaders: somewhere in our code we create af unction that fetches API data then we apply that loader function to a route and that route will then fetch that data as soon as that app goest to that route... then when that data arrives that data will be provided to the page itself via a custom hook

This sound confusing so...
_Let's impelement this with the menu data_
1). first we create the loader

export async function loader() {
// all we want to do is call the getMenu function which fetches data from a menu API (jonas' menu API)
const menu = await getMenu();
return menu;
// all we want to do is return this data
}

2). We provide the loader
all we do is go back to our rooutes and specify the loader property and give it the value of our Loader we created in the prvious step.

      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
      },

3).We provide the data to the page
all we have to do is useLoaderData()...this custom hook is beauitful
React ROuter auto knows the data we want is the one associated with the loader property
now we have the data inside the page to use as we wish.

const menu=useLoaderData();

Convention... provide loader for a certain page inside the file of that page.

So this is called "render as we fetch"... react router fetches this data simultaenously with rendering the correcr route...
before we were useing a "fetch on render" approach, where component renders THEN we fetch the data.
This new approach avoids data-loading waterfalls.
A data loading waterfall is when data is loaded in stages rather than all at once.

one more thing: loaders actually do have the param, at least, as an arguement bc we cant use useSearchParams() inside loader functions bc they are not components. SO this gives us a way to utlize these params in functions... tahnks React ROuter!

## ANOTHER ONE OF REACT ROUTES NEW POWERFUL FEATURES: useNavigation() HOOK

NOT navigate()--->useNavigation()....
tells us if our ENTIRE application is idle, submitting, or is loading
if any page is loading, our application state will be loading.
So lets make one generic big loader in AppLayout
Cpode:

const navigation = useNavigation();
const isLoading = navigation.state === "loading";

## HANDLING ERRORS WITH NEW REACT ROUTER

we just hve to specify an error on the prent route as a property (if we want one generic error)...
this is because errors nested will bubble up:

Code:
const router = createBrowserRouter([
{
element: <AppLayout />,
errorElement: <Error />,
children: [......]
}
])

The component rendering the error gets access to the exact error message... in our case thats <Error/>
then inside that component we can specify...
const error=useRouteError()

if we want specific nested components to have some error UI and not have the error component take up the entire screen we can specify it on a nested compoonent. In our case it makes sense with the menu path bc thats actually loading some error and therefore has capacity for errors.

Errors will bubble up to parent route unless its handled on the route that the error actually ocurred in.

## ANOTHER ONE OF REACT ROUTES NEW POWERFUL FEATURES: Actions

actions are used to write or mutate data, while loaders are to read data

we now have a form component that React Router gives us...
well replace the html form with this one...

<Form method="POST" action="order/new">
it has method and action properties.
We dont avtually need to specify action here bc by default React ROuter will use the closest ROute but well leave it like this for learning purposes

Behind the scenes whenevr this form is submitted, React Router will call the action function and pass in the request that was submitted, which we can accept in that action function.

now we go back and place this in the appropriate route as an action property.
{
path: "/order/new",
element: <CreateOrder />,
action: createOrderAction,
},

now whenever the form is submitted we can grab that request and make an order object out of it, which is suitable for our createOrder function... then if we redirect based off that result (via await) we can go to the page of that order based off that request we originally had:

export async function action({ request }) {
const formData = await request.formData();
const data = Object.fromEntries(formData);

<!-- These two are standard lines of code from getting data from that form -->

const order = {
...data,
cart: JSON.parse(data.cart),
priority: data.priority === "on",
};

const newOrder = await createOrder(order);

return redirect(`/order/${newOrder.id}`);
}

a little more on redirect:
we usse this instead of useNavigate()bc again we can only use hooks inside of components....
redirect is pretty much our replceement for useNavigate
for iside functions instead of components
It works with the web APIs standard request and response APIs.

## ERROR HANDLING IN REACT ROUTER

our updated action function that accounts for form errors (like invalid phone number)...

export async function action({ request }) {
const formData = await request.formData();
const data = Object.fromEntries(formData);
const order = {
...data,
cart: JSON.parse(data.cart),
priority: data.priority === "on",
};

const errors = {};
if (!isValidPhone(order.phone))
errors.phone =
"Please give us your correct phone number. We might need it to contact you.";

if (Object.keys(errors).length > 0) return errors;
// if no errors exist in the errors object, create new order and redirect

const newOrder = await createOrder(order);
return redirect(`/order/${newOrder.id}`);
}

ok so now we can get access to the data returned from this action... we will grab the error information to display it on screen....
const formErrors=useActionData()
ANOTHER custom hook... its for any data
but the most common use case if for errors...
useActionData is just us getting the data that is returned from that action.

<!-- ////////////////////////////////////TAILWIND CSS //////////////////////////// -->

# TAILWIND CSS

## intro

a utility-first CSS framework packed with utility classes like flex, text-center, and rotate-90 that can be composed to build any design, directly in your markup
utility-first approach: writing tiny classes with one single purpose, then combining them to build layouts.
In Tailwind, all these classes are already written for us, so we wont be using any new CSS, but instead use one of tailwind's hundreds of classes!

GOOD:
dont need to think ab class names.
Jumping between files to write markup and styles.
Immediately understand styling in any project that uses tailwind
Tailwind is like a design sysytem that has taken many good design descisions for you, which make UI looks better and more consitent
Saves a lot of time and responsive design
REALLY good docs and VS code integration

THE BAD:
Markup looks very unreadable with lots of tiny class names
You will have to learn a lot of class names
you need to install and set up tailwind on each project
youre giving up on vanilla CSS

## setup

like every part of a tech stack, go to the docs for installation instructions!
this is the same if you have any syntax questions

## responsive design w tailwind

tailwind by default uses 5 mobile-first breakpoints.
for example,

<div className="my-10 text-center sm:my-16">
whenever this breakpoint is met the sm:my-16 breakpoint class will overwrite the regular my-10

## TAILWINDS @APPLY DIRECTIVE

using @apply we can create an custom class by combining many classes together.
@layer components {
.input {
@apply w-full px-4 py-2 text-sm transition-all duration-300 border rounded-full md:px-6 md:py-3 border-stone-200 placeholder:text-stone-400 focus:ring focus:ring-yellow-400;
}
}
Now if we just give any component the className="input" it will have all of these

HOWEVER WE SHOULD NOT OVERSUSE THIS BC this would be going back to old css- making classes then applyint them, which defeats the purpose of tailwind.

ONLY use when making A LOT of properties.
IN actuality, we would jsut add these all to a React component and then reuse that whole component.

## CONFIGURING TAILWIND TO BE CUSTOM

lets configure a custom font family...
first lets add our desired font directly into our html as per usual.
Then lets go to the tailwind.config.js file and configure...
if we go to tailwinds documentation we can see the default of their thousands of properties and whats not, but lets focus on fontFamily:

/** @type {import('tailwindcss').Config} \*/
export default {
content: ["./index.html", "./src/**/\*.{js,ts,jsx,tsx}"],
theme: {
extend: {},
fontFamily: {
pizza: "Roboto Mono, monospace",
},
},
plugins: [],
};

This is good, now we can write font-pizza and get this font wherever we want but we can possibly do better...
we can overwrite tailwinds sans font so this overwrites the default sans font tailwind applies to our entire page...
/** @type {import('tailwindcss').Config} \*/
export default {
content: ["./index.html", "./src/**/\*.{js,ts,jsx,tsx}"],
theme: {
extend: {},
fontFamily: {
sans: "Roboto Mono, monospace",
},
},
plugins: [],
};

note: pizza-font is not a font with this option.
also note: if we DONT directly place these custom configs in the extends and ONLY put them as an object inside theme, they will be the ONLY (in this case) font available... lets add a custom color ON TOP of all the of the pre-existing tailwind colors...
/** @type {import('tailwindcss').Config} \*/
export default {
content: ["./index.html", "./src/**/\*.{js,ts,jsx,tsx}"],
theme: {
extend: {
colors:{
pizza:"#123456"
}
},
fontFamily: {
sans: "Roboto Mono, monospace",
},
},
plugins: [],
};

There, now we have a custom color called pizza.

////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
ADVANCED REDUX AND REACT ROUTER

## ADDING REDUX

so this is all p much review so i will not write notes here... if you need help with this material check out the precious section on Redux, useReducer, contextAPI etc.

# createAsyncThunk

const fetchAddress = createAsyncThunk("user/fetchAddress", {ASYNC FUNCTION});

<!-- this function needs to return a promise so an async function is ideal here -->

Takes two inputs: the name and then the function that will return the payload for the reducer later

now this fetchAddress function is the action creator we will later call in our code.
DONT CALL IT GET--> saved for selectors by convention.

this async thunk will create 3 additional action types:
one for pending promise, fufilled promise, and one for rejected promise... now we have to handle these cases seperaterly back in our reducer.

const initialState = {
username: "",
status: "idle",
position: {},
address: "",
error: "",
};

const userSlice = createSlice({
name: "user",
initialState,
reducers: {
updateName(state, action) {
state.username = action.payload;
},
},
extraReducers: (builder) =>
builder
.addCase(
fetchAddress.pending,
(state, action) => (state.status = "loading")
)
.addCase(fetchAddress.fulfilled, (state, action) => {
state.position = action.payload.position;
state.address = action.payload.address;
state.state = "idle;";
})
.addCase(fetchAddress.rejected, (state, action) => {
state.status = "error";
state.error = action.error.message;
}),
});

HERE, WE WILL CREATE AN "EXTRAREDUCER" for each case we previously mentioned for that fetchAddress promise.

# useFetcher

the fecther custom hook allows us to call a loader or action without changing the url. Now we can plug our UI into actions and loaders WITHOUT also navigating.

<fetcher.Form>
is similar to <Form>, however with fetcher, no navigation will occur, it will submit the form and re-validation will happen.
revalidation is when our router knows the data has changed, in this case because of the action function, so it automatically refetches the data in the bg and displays the page with the updated data.

There's two ways of updating data, there is the PUT or the PATCH request.
PUT: we have to pass in the entire updated object
PATCH: will only take in the data that has actually changed and will add that to the original object on the server.
