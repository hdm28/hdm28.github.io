% A = (-calcq(X(1),X(2)) - sqrt( ((calcq(X(1),X(2)))^2) - 4*X(1)*(X(2)-0.1))) /  (2*X(1))
p = 1.38;
r = 0.121;
node = 0.1;
w = p*(node^2) + calcq(p,r)*(node) + r

