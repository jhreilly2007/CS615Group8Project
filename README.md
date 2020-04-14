# CS615GroupProject: Collaborative Task Sharing
##Class project for CS615: Internet Solutions

###to run : npm install
###to start: npm start

-Backend is working. User authentication is working. Password is encypted before storing in database. Authorization is working using Express-sessions. User must be logged in to access task or groups. We can change tasks etc and details but structure is in place and working.
-User can add/ delete and edit tasks. Tasks are showing on the website to authorized users.

##Goals of the project:
Develop a data-model (realisable in JSON), together with an accompanying RESTful API for the collaborative management of tasks.

(i) A user signs into their online account, creates a task or edits a task previously created. For now, a task consists of a title, a description, and an optional link to a resource (e.g. to a website or an online image), and optional contextual annotations (e.g. tags that further describe the task, such as ‘important’, ‘project X’). The user may decide to make the task private-only access, to share it with a group, or to make it publicly accessible.
(ii) A user signs into their online account and may pick a task and, mark it as completed at which point the user may attach a resource to the task, which can be done in the form of a link that points to a result (e.g. a link to a solution online or to a PDF document).
(iii) Any user may create and manage groups which can be used to share tasks within this group. Any user who creates a group automatically owns this group who can then also invite other users (or remove them). Users may search for public groups. Users may apply to become members of a group, or they may be invited to join by the group owner. Members may leave or be removed from the group by the owner.
