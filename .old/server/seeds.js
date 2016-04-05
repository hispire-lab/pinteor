
Meteor.startup(function () {
  Meteor.users.remove({});
  Boards.remove({});
  Pins.remove({});
  var dummyUserNames = ['giorgix', 'pitxon'];
  var userIds = [];
  var boardsId = [];
  dummyUserNames.forEach(function(username){
    //`createUser` returns the id of the created user
    userIds.push(Accounts.createUser({
        username: username,
        password: '123456'
      }));
  });


// Boards
[
    {
      name: "Food",
      description: 'Excellent food',
      isPrivate: false,
      userId: userIds[0]
    },
    {
      name: "Animals",
      description: 'Cute animals',
      isPrivate: true,
      userId: userIds[0]
    },
    {
      name: "Cars",
      description: 'Amazing cars',
      isPrivate: false,
      userId: userIds[1]
    },
    {
      name: "Drinks",
      description: 'Good drinks',
      isPrivate: true,
      userId: userIds[1]
    }
  ].forEach(function(board){
    boardsId.push(Boards.insert(board));
  });


  // Pins
  [
      {
        title: "Macarroni",
        imgUrl: 'http://youthindependent.com/wp-content/uploads/2015/12/macandcheese.jpg',
        boardId: boardsId[0],
        userId: userIds[0]
      },
      {
        title: "Cat",
        imgUrl: 'https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg',
        boardId: boardsId[1],
        userId: userIds[0]
      },
      {
        title: "Bugatti",
        imgUrl: 'http://o.aolcdn.com/dims-shared/dims3/GLOB/crop/1920x1081+0+161/resize/800x450!/format/jpg/quality/85/http://o.aolcdn.com/hss/storage/midas/4db1f421cfe513302fa43561f7570363/202640194/01-bugatti-vision-gran-turismo-concept-frankfurt.jpg',
        boardId: boardsId[2],
        userId: userIds[1]
      },
      {
        title: "Beer",
        imgUrl: 'http://images.mentalfloss.com/sites/default/files/styles/article_640x430/public/beer_10.jpg',
        boardId: boardsId[3],
        userId: userIds[1]
      }
    ].forEach(function(pin){
      Pins.insert(pin);
    });
});
