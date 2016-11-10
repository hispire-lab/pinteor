# pinteor

# ui
The ui is splitted in four different types of components:

**components:** this are what the meteor guide calls reusable components, this
means that this part of the ui don't know anything about things like the router
or subscriptions, they just receive data and populate his template with that
data.
For a test point of view have sense to prepare some fixtures to fake
the data context that the component expects, and test that the DOM is render
the data in the proper nodes, this tests should be runned with the test meteor
mode.

**pages:** pages are very similar to components, this is different than the
meteor guide know as pages, in this case pages are reusable components too.
They usually receive as data context an object, like user for example and some
ready function, like userReady. Pages main responsability is to determine if
the page is loading (userReady returns false), if should render a not found
(user is null or undefined) and render a child component with the proper
data context.
For test pages the rules are mainly the same as for components, the only thing
to take into account is to test all possible branches that the page can be.

**layouts:** layouts are similar to pages, the main difference is that layouts
contains a Template.dynamic inside, so they can render other parts of the ui
dynamically, usually other pages or containers.

**containers:** inside containers is where all outside world comunication
happens, it what the meteor guide call smart components, his task is to get
information from the router and usually use this information to subscribe to
some publication, then make available the content received throught the
subscriptions via helpers and render a child with the proper data context.
Containers can render any kind of ui components, they can render either
components, pages and layouts. 
