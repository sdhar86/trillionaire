items = [
{name: "Buy a Monkey", cost: 500},
{name: "Hire an intern", cost: 1000},
{name: "Run a code sweatshop in India", cost: 4000},
{name: "Hire a Perl Developer", cost: 8000},
{name: "Hire a PHP Developer", cost: 10000},
{name: "Hire a Node.js Developer", cost: 20000},
{name: "Hire a Meteorite", cost: 40000},
{name: "Strip on Weekends", cost: 100000},
{name: "Buy a Strip Club", cost: 500000},
{name: "Buy a Club", cost:1000000 },
{name: "Win a Lottery", cost: 5000000},
{name: "Buy Percolate Studios", cost: 10000000},
{name: "Buy Dropbox", cost: 120000000},
{name: "Buy Instagram", cost: 500000000},
{name: "Revive SilkRoad", cost: 1000000000},
{name: "Buy Yahoo", cost: 1500000000},
{name: "Buy Facebook", cost: 2000000000},
{name: "Buy Google", cost: 400000000000},
{name: "Buy Apple", cost: 700000000000},
{name: "Pay Uncle Sam's Debt", cost:18000000000000}
]


if (Meteor.isClient) {


  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe('userData');

    Template.hello.helpers ({
      user: function() {
        return Meteor.user();
        },

      items: function () {
        return items;
      }

    });

    Template.leaderboard.helpers({
      players: function(){
        return Meteor.users.find({}, {sort: {'money': -1}});
      }  
    });


    Template.hello.events({
      'click .code': function () {
        Meteor.call('click');
      }
    });    


    Template.hello.events({
      'click input.buy': function (event) {
        Meteor.call('buy', event.target.id); 
      }
    });
}



if (Meteor.isServer) {

    Accounts.onCreateUser(function(options, user) {
    user.money = 0;
    user.rate = 0;
    return user;
  });


  Meteor.publish("userData", function () {
    return Meteor.users.find({}, {sort: {'money': -1}});
  });

  Meteor.methods({
    click: function () {
      Meteor.users.update({_id: this.userId}, {$inc: {'money': 25}});
    },

     buy: function(amount) {
      if(Meteor.user().money >= amount && amount > 0) 
      Meteor.users.update({_id: this.userId}, {$inc: {'rate': (Math.floor(amount/500)), 'money': (0-amount)}}); 
    },

  });

  Meteor.startup(function () {
    Meteor.setInterval(function() {
      Meteor.users.find({}).map(function(user) {
        Meteor.users.update({_id: user._id}, {$inc: {'money': user.rate}})
      });
    }, 1000);

    Meteor.setInterval(function() {
      Meteor.users.find().map(function(user) {
        Meteor.users.update({_id: user._id}, {$set: {'money': 0, 'rate': 0}})
      });
    }, 1000*60*60*24)
  });

}
