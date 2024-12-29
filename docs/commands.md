   `add           Add to the pickup`
```
    Add yourself to the list of players for the current pickup

    ![add|add_me|addme|join]
```
  `add_alias     Add a new map alias`
```
  Adds a new alias to an existing map (row) to the maps collection (table) in the MongoDB

![add_alias|update_map|updatemap]
```
  `addmap        Add a new map`
```
  Adds a new map (row) to the maps collection (table) in the MongoDB

![addmap|add_map|new_map|newmap]
```
  `addserver     Add a new server`
```
  Adds a new server (row) to the servers collection (table) in the MongoDB

![addserver|add_server|new_server|newserver]
```
  `admin         Displays the admin of the current pickup`
```
  Displays the admin who is in control of the current pickup

![admin|game_admin|gameadmin|game_starter|gamestarter|starter]
```
  `ban           Ban a player`
```
  Admin only command that bans a user from the channel for the period specified

!ban @user length hour(s)|day(s)|week(s)|month(s)|year(s) (pick one) Reason for the ban

![ban|ban_player|banplayer|timeout]
```
  `banned        List all banned players`
```
  List all the bans currently saved in the mongoDB

!banned

![banned|banned_player|bannedplayer|banned_players|bannedplayers]
```
  `bitcoin       Display Current BTC <-> USD Price`
```
  Get the current price of bitcoin in USD

    ![bitcoin|btc]
```
  `changelevel   Change the map in server`
```
  Change the map in the server using the RCON command changelevel

![changelevel|changemap|rcon changemap|rcon_changemap|rcon changelevel|rcon_changelevel]
```
  `delmap        Delete an existing map`
```
  Removes an existing map (row) from the maps collection (table) in the MongoDB

![delmap|del_map|delete_map|deletemap]
```
  `delserver     Delete an existing server`
```
  Removes an existing map (row) from the maps collection (table) in the MongoDB

![delserver|del_server|delete_server|deleteserver]
```
  `demos         Get a link to the demos`
```
  Provides the message author with a link to the currently stored demos via direct message

![demos|demo|recordings|recording]
```
  `end           End the current pickup`
```
  Command that ends the current pickup, cannot have new user role

![end|edn|kill|ned|stop]
```
  `forcenominate Force Nominate the specified map for a player`
```
  Admin only command to force a nomination of the map you specified, for the player you specified

![forcenominate|forceelect|forcenom|forcenomination|force_elect|force_nominate|force_nom|force_nomination]
```
  `hawking       Quote from Dr. Stephen Hawking`
```
  Displays a random quote from The Great Dr. Hawking

![hawking|hawking_quote|hawkingquote|quote]
```
  `help          Shows this message`
```
  !help

Shows this message

Arguments:
  command No description given
```
  `journals      Link to Stephen Hawking journals`
```
  Displays a link to 55 papers in Physical Review D and Physical Review Letters, gathered together and made public by the American Physical Society

![journals|aps|american_physical_society|americanphysicalsociety|hawking_journal|hawkingjournal|hawking_journals|hawkingjournals|journal]
```
  `last          Show the last pickup info`
```
  Displays information about the last pickup that was played

![last|last_game|lastgame|last_pug|lastpug]
```
  `lastfive      Show info about the last 5 pickups`
```
  Displays information about the last 5 pickups that were played

![lastfive|last_five|last_5|last5]
```
  `map           Show the selected map`
```
  Show the chosen map for the current pickup

![map|what_map_won|whatmapwon]
```
  `maplist       Show the list of maps available`
```
Provides you with a list of all the maps that are available for nomination via direct message

![maplist|list_maps|listmaps|map_list]
```
  `maps          Show the nominated maps`
```
  List all of the maps that have been nominated for the current pickup

![maps|nominated|nominate_maps|nominatedmaps]
```
  nominate      Nominate the specified map
```
  Nominate the map you specified, provided it is valid

![nominate|elect|iwanttoplay|nom]
```
  `permaban      Permanently ban a player`
```
  Admin only command that bans a user from the channel FOREVER

!permaban @user Reason for the ban

![permaban|perma_ban|permaban_player|permabanplayer]
```
  `pickup        Start a new pickup`
```
Start a new pickup, if one is not already currently running

![pickup|new_game|newgame|new|new_pickup|pikcup|start|start_game]
```
  `players       Change the number of players in pickup`
```
  Change the number of players per team, cannot have new player role

![players|players_per_team|size_of_teams|sizeofteams|team_size|teamsize]
```
  `pug           Give you access to the channel`
```
Allow user access to the pickup channel 

![pug|letmein]
```
  `pugbot        Answers from the pugbot`
```
  Answers a yes or no question

![pugbot|8ball|8-ball|eight_ball|eightball]
```
  `rcon          RCON relay to the set server`
```
  Executes the command you specify in the server, using Remote CONnection

![rcon|remote_connection]
```
  `records       Get a link to the All-time Records`
```
  Get a link to the All-time Records on ffpickup.com

![records|alltime|alltime_records|best]
```
  `remove        Removes the user from the pickup`
```
Remove yourself or the specified player (Admin only) and any map nomination they may have from the pickup

![remove|removeme|remove_me|removeplayer|remove_player]
```
  `removenom     Removes the specified map nomination from the pickup`
```
  Allows an admin to remove a map nominate from the list

![removenom|removenomination|remove_nom|remove_nomination|vetonomination|veto_nom|veto_nomination]
```
  `sendinfo      Send server info via DM`
```
  Sends the server IP and password via direct message

![sendinfo|send_info]
```
  `setmode       Change the way the map is picked`
```
Change the way the map is picked. Options are random or vote. User cannot have new player role

![setmode|changemode|change_mode|set_mode]
```
  `setserver     Change the server information`
```
  Change the server the pickup will be played on (Game Starter Only)

![setserver|changeserver|change_server|set_server]
```
  `teams         Display current pickup info`
```
  Displays all of the members in the current pickup

![teams|game_info|gameinfo]
```
  `transfer      Transfer the current pickup to/from another admin`
```
  Give your pickup to another admin (Game Starter) or take possession of another admins pickup (All Other Admins)

![transfer|give|take]
```  
  `unban         Unban a player`
```
  Remove a ban for the specified user from the database and grant them access once more

![unban|del_ban|delban|un_ban|remove_ban|removeban]
```
  `unsubscribe   Leave the pickup channel`
```
  Allows users to leave the notification group, which removes them from the channel

![unsubscribe|unpug|unsub|letmeout]
```