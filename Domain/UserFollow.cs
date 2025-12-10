using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollow
    {
        public string FollowingId { get; set; }
        public User Following { get; set; }
        public string FollowerId { get; set; }
        public User Follower { get; set; }
    }
}
